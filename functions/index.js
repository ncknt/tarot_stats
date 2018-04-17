const functions = require('firebase-functions');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const os = require('os');

const admin = require('firebase-admin');
admin.initializeApp();
const gcs = require('@google-cloud/storage')();
const spawn = require('child-process-promise').spawn;

/**
 * When an image is uploaded in the Storage bucket the information and metadata of the image (the
 * output of ImageMagick's `identify -verbose`) is saved in the Realtime Database.
 */
exports.metadata = functions.storage.object().onFinalize((object) => {
    const filePath = object.name;

    // Create random filename with same extension as uploaded file.
    const randomFileName = crypto.randomBytes(20).toString('hex') + path.extname(filePath);
    const tempLocalFile = path.join(os.tmpdir(), randomFileName);

    // Exit if this is triggered on a file that is not an image.
    if (!object.contentType.startsWith('image/')) {
        console.log('This is not an image.');
        return null;
    }

    // Download file from bucket.
    const bucket = gcs.bucket(object.bucket);
    return bucket.file(filePath).download({ destination: tempLocalFile }).then(() => {
        // Get Metadata from image.
        return spawn('identify', ['-verbose', tempLocalFile], { capture: ['stdout', 'stderr'] });
    }).then(() => {
        const metadata = imageMagickOutputToObject(result.stdout);
        // Save metadata to realtime datastore.
        return admin.database().ref(makeKeyFirebaseCompatible(filePath)).set(metadata);
    }).then(() => {
        return console.log('Wrote to:', filePath, 'data:', metadata);
    }).then(() => {
        // Cleanup temp directory after metadata is extracted
        // Remove the file from temp directory
        fs.unlinkSync(tempLocalFile);
        return console.log('cleanup successful!');
    });
});

/**
 * Convert the output of ImageMagick's `identify -verbose` command to a JavaScript Object.
 */
function imageMagickOutputToObject(output) {
    let previousLineIndent = 0;
    const lines = output.match(/[^\r\n]+/g);
    lines.shift(); // Remove First line
    lines.forEach((line, index) => {
        const currentIdent = line.search(/\S/);
        line = line.trim();
        if (line.endsWith(':')) {
            lines[index] = makeKeyFirebaseCompatible(`"${line.replace(':', '":{')}`);
        } else {
            const split = line.replace('"', '\\"').split(': ');
            split[0] = makeKeyFirebaseCompatible(split[0]);
            lines[index] = `"${split.join('":"')}",`;
        }
        if (currentIdent < previousLineIndent) {
            lines[index - 1] = lines[index - 1].substring(0, lines[index - 1].length - 1);
            lines[index] = new Array(1 + (previousLineIndent - currentIdent) / 2).join('}') + ',' + lines[index];
        }
        previousLineIndent = currentIdent;
    });
    output = lines.join('');
    output = '{' + output.substring(0, output.length - 1) + '}'; // remove trailing comma.
    output = JSON.parse(output);
    console.log('Metadata extracted from image', output);
    return output;
}

/**
 * Makes sure the given string does not contain characters that can't be used as Firebase
 * Realtime Database keys such as '.' and replaces them by '*'.
 */
function makeKeyFirebaseCompatible(key) {
    return key.replace(/\./g, '*');
}