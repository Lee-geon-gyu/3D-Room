import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';

test('Lounge uses the exact supplied 1469x1071 PNG, without a generated replacement or color grade',()=>{
 const source=readFileSync(new URL('../public/assets/ending/wood-ocean-lounge.png',import.meta.url));
 assert.equal(createHash('sha256').update(source).digest('hex'),'952b062ac00be727eb8585e0bdb9d4f0ad944160810ba275e027712e0b38a6f4');
 assert.equal(source.readUInt32BE(16),1469);assert.equal(source.readUInt32BE(20),1071);
});

