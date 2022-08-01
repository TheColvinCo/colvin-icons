#!/usr/bin/env node
const program = require('commander');
const { optimize } = require('svgo');
const { join } = require('path');
const { readdir, existsSync, readFileSync, promises } = require('fs');

program.option('-s, --source <source>', 'folder of source svg files');
program.option('-d, --dist <dist>', 'folder of optimized svg filess');
program.parse();

const { source, dist } = program.opts();

const BASE_DIR = process.cwd();
const SVG_FOLDER = join(BASE_DIR, source);
const SVG_DIST_FOLDER = join(BASE_DIR, dist);

const svgoConfig = {
  multipass: true,
  js2svg: { indent: 2, pretty: true },
  plugins: [
    'preset-default',
    'prefixIds',
    { name: 'sortAttrs', params: { xmlnsOrder: 'alphabetical' } },
  ],
};

(() => {
  try {
    if (!source || !dist) {
      throw Error('You need a directory to optimize the icons');
    }

    readdir(SVG_FOLDER, async (err, files) => {
      if (err) return console.log('Unable to scan directory:', err);

      const exist = existsSync(SVG_DIST_FOLDER);
      if (!exist) await promises.mkdir(SVG_DIST_FOLDER, { recursive: true });

      files.forEach(async file => {
        const svgString = readFileSync(join(SVG_FOLDER, file), 'utf-8');
        const { data, path } = await optimize(svgString, {
          path: join(SVG_DIST_FOLDER, file),
          ...svgoConfig,
        });

        await promises.writeFile(path, data);
      });
    });

    console.log('\n⭐️ SVG files optimized correctly!\n');
  } catch (e) {
    console.log(e);
    process.exit(-1);
  }
})();
