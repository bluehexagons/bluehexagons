import sharp from 'sharp';
import { globSync } from 'glob';
import path from 'path';
import fs from 'fs';

const ASSETS_DIR = path.join(process.cwd(), 'public/assets');
const THUMBS_DIR = path.join(ASSETS_DIR, 'thumbs');

// Ensure thumbs directory exists
if (!fs.existsSync(THUMBS_DIR)) {
    fs.mkdirSync(THUMBS_DIR, { recursive: true });
}

// Find all images
const images = globSync('**/*.{png,jpg,jpeg,gif,webp}', {
    cwd: ASSETS_DIR,
    ignore: ['thumbs/**', 'icons/**']
});

async function generateThumbs() {
    console.log(`Found ${images.length} images to check.`);
    
    let generatedCount = 0;

    for (const imagePath of images) {
        const fullSourcePath = path.join(ASSETS_DIR, imagePath);
        const fullDestPath = path.join(THUMBS_DIR, imagePath);
        const destDir = path.dirname(fullDestPath);

        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        if (!fs.existsSync(fullDestPath)) {
            console.log(`Generating thumbnail for: ${imagePath}`);
            try {
                await sharp(fullSourcePath)
                    .resize(300, null, { withoutEnlargement: true }) // Width 300px, maintain aspect ratio, don't enlarge small images
                    .toFile(fullDestPath);
                generatedCount++;
            } catch (err) {
                console.error(`Error generating thumbnail for ${imagePath}:`, err);
            }
        }
    }
    console.log(`Thumbnail generation complete. Generated ${generatedCount} new thumbnails.`);
}

generateThumbs();
