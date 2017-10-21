'use strict';

import { utf8Encode, add, CLS, ConvertToWordArray } from './helpers';

type Vector = [number, number, number, number];

type Generator = (x: number, y: number, z: number) => number;


/**
 * MD5算法
 * Author: 何志宇<15331097>
 */
export default class MD5 {

    /**
     * 进行MD5摘要加密
     * @param {string} input 输入的要进行摘要处理的字符串
     * @returns {string} 输出128位的摘要(以16进制显示)
     */
    public static hash(input: string): string {
        let utf8 = utf8Encode(input);
        let bits = ConvertToWordArray(utf8);
        let v = MD5.calculate(bits);
        return this.vectorToHex(v);
    }


    /**
     * 将固定长度的块进行迭代循环, 生成最后的向量
     * @param {number[]} bits 将原始消息进行补全而且添加了长度数据，再进行分块
     * @returns {Vector} 最后一次迭代输出的向量CV
     */
    public static calculate(bits: number[]): Vector {

        /**
         * 初始向量
         */
        let [a, b, c, d] = [
            0x67452301,
            0xefcdab89,
            0x98badcfe,
            0x10325476
        ];

        /**
         * 该大循环是对每一个512bits的块进行迭代，
         * 这个512bits的大块被分成了16个32位的字段
         */
        for (let k = 0; k < bits.length; k += 16) {

            /**
             * 记录下一开始的向量
             */
            let [AA, BB, CC, DD] = [a, b, c, d];
            /**
             * F轮次
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
             * G轮次
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
             * H轮次
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
             * I轮次
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
             * Final加和
             */
            a = add(a, AA);
            b = add(b, BB);
            c = add(c, CC);
            d = add(d, DD);
        }
        return [a, b, c, d];
    }


    /**
     * 下面4个都是线性生成器函数32位
     */
    private static F: Generator = (x, y, z) => (x & y) | ((~x) & z);
    private static G: Generator = (x, y, z) => (x & z) | (y & (~z));
    private static H: Generator = (x, y, z) => (x ^ y ^ z);
    private static I: Generator = (x, y, z) => (y ^ (x | (~z)));


    /**
     * 主要的压缩函数，输入有两个：前一个向量，和当前512bits大块中的某一个小块（32位）
     * @param {any} A 向量
     * @param {any} B 向量
     * @param {any} C 向量
     * @param {any} D 向量
     * @param {Generator} g 生成器函数，为FGHI中的某一个
     * @param {number} Xk 有原始消息得来的某一小块32位
     * @param {number} Ti 来自int(2^32 | sin(i))，i作为弧度输入,且i是每一次小迭代的轮次
     * @param {number} s 需要左移的值
     * @returns {number} 返回一个32位的数作为向量的一部分
     * @constructor
     */
    private static Hmd5([A, B, C, D]: Vector, g: Generator, Xk: number, Ti: number, s: number): number {
        return add(B, CLS(add(add(add(A, g(B, C, D)), Xk), Ti), s));
    }

    /**
     * 将向量转换为16进制表示
     * @param {Vector} arr 向量
     * @returns {string}16进制字符串
     */
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