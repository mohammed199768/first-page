const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.join(__dirname, 'public', 'assets', 'magnific-frames');

async function processFrames() {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));
  console.log(`Found ${files.length} PNGs to compress.`);
  
  let totalSaved = 0;

  for (const file of files) {
    const inputPath = path.join(dir, file);
    const outputName = file.replace('.png', '.webp');
    const outputPath = path.join(dir, outputName);
    
    const inputStat = fs.statSync(inputPath);
    
    await sharp(inputPath)
      .webp({ quality: 75 })
      .toFile(outputPath);
      
    const outputStat = fs.statSync(outputPath);
    const saved = inputStat.size - outputStat.size;
    totalSaved += saved;
    
    console.log(`Converted ${file} -> saved ${(saved / 1024).toFixed(2)} KB`);
    
    // Delete original to save space
    fs.unlinkSync(inputPath);
  }
  
  console.log(`Done! Total space saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);
}

processFrames().catch(console.error);
