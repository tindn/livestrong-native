const contentsTemplate = require('./iosIconsetContentsTemplate.json');
const child_process = require('child_process');
const path = require('path');
const fs = require('fs');
//  We've got the iconset folder. Get the contents Json.
const iconsetPath = './ios/LivestrongNative/Images.xcassets/AppIcon.appiconset';
const contentsPath = path.join(iconsetPath, 'Contents.json');

var contents = JSON.parse(fs.readFileSync(contentsPath, 'utf8'));
contents.images = [];

// //  Generate each image in the full icon set, updating the contents.
Promise.all(
	contentsTemplate.images.map(image => {
		const actualSize = parseInt(image.size) * parseInt(image.scale);
		const targetName = `${image.idiom}-${image.size}x${image.size}-${
			image.scale
		}x.png`;
		const targetPath = path.join(iconsetPath, targetName);
		return generateIcon('./assets/logo.svg', targetPath, actualSize).then(
			() => {
				console.log(`    ✓  Generated ${targetName}`);
				contents.images.push({
					size: `${image.size}x${image.size}`,
					idiom: image.idiom,
					scale: `${image.scale}x`,
					filename: targetName
				});
			}
		);
	})
).then(() => {
	fs.writeFileSync(contentsPath, JSON.stringify(contents, null, 2), 'utf8');
	console.log(`    ✓  Updated Contents.json`);
});

function generateIcon(source, target, size) {
	return new Promise((resolve, reject) => {
		const command = `rsvg-convert ${source} -w ${size} > ${target}`;
		child_process.exec(command, (err, stdout, stderr) => {
			if (err) {
				console.log('child processes failed with error code: ' + err.code);
				return reject(err);
			}
			return resolve();
		});
	});
}
