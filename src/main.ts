'use strict';

import { utf8Encode, add, CLS, ConvertToWordArray } from './helpers';

type Vector = [number, number, number, number];

type Generator = (x: number, y: number, z: number) => number;

export default class MD5 {
    public static hash(input: string): string {
        let utf8 = utf8Encode(input);
        let bits = ConvertToWordArray(utf8);
        let v = MD5.calculate(bits);
        return this.vectorToHex(v);
    }


    public static calculate(bits: number[]): Vector {
        let [a, b, c, d] = [
            0x67452301,
            0xefcdab89,
            0x98badcfe,
            0x10325476
        ];
        for (let k = 0; k < bits.length; k += 16) {
            let [AA, BB, CC, DD] = [a, b, c, d];
            /**
             * F
             */
            a = this.Hmd5([a, b, c, d], this.F, bits[k], 0xD76AA478, 7);
            d = this.Hmd5([d, a, b, c], this.F, bits[k + 1], 0xE8C7B756, 12);
            c = this.Hmd5([c, d, a, b], this.F, bits[k + 2], 0x242070DB, 17);
            b = this.Hmd5([b, c, d, a], this.F, bits[k + 3], 0xC1BDCEEE, 22);

            a = this.Hmd5([a, b, c, d], this.F, bits[k + 4], 0xF57C0FAF, 7);
            d = this.Hmd5([d, a, b, c], this.F, bits[k + 5], 0x4787C62A, 12);
            c = this.Hmd5([c, d, a, b], this.F, bits[k + 6], 0xA8304613, 17);
            b = this.Hmd5([b, c, d, a], this.F, bits[k + 7], 0xFD469501, 22);

            a = this.Hmd5([a, b, c, d], this.F, bits[k + 8], 0x698098D8, 7);
            d = this.Hmd5([d, a, b, c], this.F, bits[k + 9], 0x8B44F7AF, 12);
            c = this.Hmd5([c, d, a, b], this.F, bits[k + 10], 0xFFFF5BB1, 17);
            b = this.Hmd5([b, c, d, a], this.F, bits[k + 11], 0x895CD7BE, 22);

            a = this.Hmd5([a, b, c, d], this.F, bits[k + 12], 0x6B901122, 7);
            d = this.Hmd5([d, a, b, c], this.F, bits[k + 13], 0xFD987193, 12);
            c = this.Hmd5([c, d, a, b], this.F, bits[k + 14], 0xA679438E, 17);
            b = this.Hmd5([b, c, d, a], this.F, bits[k + 15], 0x49B40821, 22);

            /**
             * G
             */
            a = this.Hmd5([a, b, c, d], this.G, bits[k + 1], 0xf61e2562, 5);
            d = this.Hmd5([d, a, b, c], this.G, bits[k + 6], 0xc040b340, 9);
            c = this.Hmd5([c, d, a, b], this.G, bits[k + 11], 0x265e5a51, 14);
            b = this.Hmd5([b, c, d, a], this.G, bits[k], 0xe9b6c7aa, 20);

            a = this.Hmd5([a, b, c, d], this.G, bits[k + 5], 0xd62f105d, 5);
            d = this.Hmd5([d, a, b, c], this.G, bits[k + 10], 0x2441453, 9);
            c = this.Hmd5([c, d, a, b], this.G, bits[k + 15], 0xd8a1e681, 14);
            b = this.Hmd5([b, c, d, a], this.G, bits[k + 4], 0xe7d3fbc8, 20);

            a = this.Hmd5([a, b, c, d], this.G, bits[k + 9], 0x21e1cde6, 5);
            d = this.Hmd5([d, a, b, c], this.G, bits[k + 14], 0xc33707d6, 9);
            c = this.Hmd5([c, d, a, b], this.G, bits[k + 3], 0xf4d50d87, 14);
            b = this.Hmd5([b, c, d, a], this.G, bits[k + 8], 0x455a14ed, 20);

            a = this.Hmd5([a, b, c, d], this.G, bits[k + 13], 0xa9e3e905, 5);
            d = this.Hmd5([d, a, b, c], this.G, bits[k + 2], 0xfcefa3f8, 9);
            c = this.Hmd5([c, d, a, b], this.G, bits[k + 7], 0x676f02d9, 14);
            b = this.Hmd5([b, c, d, a], this.G, bits[k + 12], 0x8d2a4c8a, 20);

            /**
             * H
             */
            a = this.Hmd5([a, b, c, d], this.H, bits[k + 5], 0xfffa3942, 4);
            d = this.Hmd5([d, a, b, c], this.H, bits[k + 8], 0x8771f681, 11);
            c = this.Hmd5([c, d, a, b], this.H, bits[k + 11], 0x6d9d6122, 16);
            b = this.Hmd5([b, c, d, a], this.H, bits[k + 14], 0xfde5380c, 23);

            a = this.Hmd5([a, b, c, d], this.H, bits[k + 1], 0xa4beea44, 4);
            d = this.Hmd5([d, a, b, c], this.H, bits[k + 4], 0x4bdecfa9, 11);
            c = this.Hmd5([c, d, a, b], this.H, bits[k + 7], 0xf6bb4b60, 16);
            b = this.Hmd5([b, c, d, a], this.H, bits[k + 10], 0xbebfbc70, 23);

            a = this.Hmd5([a, b, c, d], this.H, bits[k + 13], 0x289b7ec6, 4);
            d = this.Hmd5([d, a, b, c], this.H, bits[k], 0xeaa127fa, 11);
            c = this.Hmd5([c, d, a, b], this.H, bits[k + 3], 0xd4ef3085, 16);
            b = this.Hmd5([b, c, d, a], this.H, bits[k + 6], 0x4881d05, 23);

            a = this.Hmd5([a, b, c, d], this.H, bits[k + 9], 0xd9d4d039, 4);
            d = this.Hmd5([d, a, b, c], this.H, bits[k + 12], 0xe6db99e5, 11);
            c = this.Hmd5([c, d, a, b], this.H, bits[k + 15], 0x1fa27cf8, 16);
            b = this.Hmd5([b, c, d, a], this.H, bits[k + 2], 0xc4ac5665, 23);

            /**
             * I
             */
            a = this.Hmd5([a, b, c, d], this.I, bits[k], 0xf4292244, 6);
            d = this.Hmd5([d, a, b, c], this.I, bits[k + 7], 0x432aff97, 10);
            c = this.Hmd5([c, d, a, b], this.I, bits[k + 14], 0xab9423a7, 15);
            b = this.Hmd5([b, c, d, a], this.I, bits[k + 5], 0xfc93a039, 21);

            a = this.Hmd5([a, b, c, d], this.I, bits[k + 12], 0x655b59c3, 6);
            d = this.Hmd5([d, a, b, c], this.I, bits[k + 3], 0x8f0ccc92, 10);
            c = this.Hmd5([c, d, a, b], this.I, bits[k + 10], 0xffeff47d, 15);
            b = this.Hmd5([b, c, d, a], this.I, bits[k + 1], 0x85845dd1, 21);

            a = this.Hmd5([a, b, c, d], this.I, bits[k + 8], 0x6fa87e4f, 6);
            d = this.Hmd5([d, a, b, c], this.I, bits[k + 15], 0xfe2ce6e0, 10);
            c = this.Hmd5([c, d, a, b], this.I, bits[k + 6], 0xa3014314, 15);
            b = this.Hmd5([b, c, d, a], this.I, bits[k + 13], 0x4e0811a1, 21);

            a = this.Hmd5([a, b, c, d], this.I, bits[k + 4], 0xf7537e82, 6);
            d = this.Hmd5([d, a, b, c], this.I, bits[k + 11], 0xbd3af235, 10);
            c = this.Hmd5([c, d, a, b], this.I, bits[k + 2], 0x2ad7d2bb, 15);
            b = this.Hmd5([b, c, d, a], this.I, bits[k + 9], 0xeb86d391, 21);

            /**
             * Final
             */
            a = add(a, AA);
            b = add(b, BB);
            c = add(c, CC);
            d = add(d, DD);
        }
        return [a, b, c, d];
    }


    private static F: Generator = (x, y, z) => (x & y) | ((~x) & z);
    private static G: Generator = (x, y, z) => (x & z) | (y & (~z));
    private static H: Generator = (x, y, z) => (x ^ y ^ z);
    private static I: Generator = (x, y, z) => (y ^ (x | (~z)));


    private static Hmd5([A, B, C, D]: Vector, g: Generator, Xk: number, Ti: number, s: number): number {
        return add(B, CLS(add(add(add(A, g(B, C, D)), Xk), Ti), s));
    }

    private static vectorToHex(arr: Vector): string {
        let result = '';
        let length32 = arr.length * 32;
        for (let i = 0; i < length32; i += 8) {
            result += String.fromCharCode((arr[i >> 5] >>> (i % 32)) & 0xff);
        }

        let hexTab = '0123456789ABCDEF';
        let output = '';
        for (let i = 0; i < result.length; i++) {
            let x = result.charCodeAt(i);
            output += hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f);
        }
        return output;
    }

}