'use strict';

export function utf8Encode(input: string): string {
    let utfText = "";

    for (let index = 0; index < input.length; index++) {
        let val = input.charCodeAt(index);

        if (val < 128) {
            utfText += String.fromCharCode(val);
        } else if (val >= 128 && val < 2048) {
            utfText += String.fromCharCode((val >> 6) | 192);
            utfText += String.fromCharCode((val & 63) | 128);
        } else {
            utfText += String.fromCharCode((val >> 12) | 224);
            utfText += String.fromCharCode(((val >> 6) & 63) | 128);
            utfText += String.fromCharCode((val & 63) | 128);
        }
    }

    return utfText;
}

export function ConvertToWordArray(string: string): number[] {
    let lWordCount: number,
        lMessageLength: number = string.length,
        lNumberOfWords_temp1: number = lMessageLength + 8,
        lNumberOfWords_temp2: number = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64,
        lNumberOfWords: number = (lNumberOfWords_temp2 + 1) * 16,
        lWordArray: Array<number> = Array(lNumberOfWords - 1),
        lBytePosition: number = 0,
        lByteCount: number = 0;

    while (lByteCount < lMessageLength) {
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
        lByteCount++;
    }

    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;

    return lWordArray;
}

export function add(left: number, right: number): number {
    const lsw = (left & 0xffff) + (right & 0xffff); // 低16位和
    const msw = (left >> 16) + (right >> 16) + (lsw >> 16); // 高16位和加上进位
    return (msw << 16) | (lsw & 0xffff); // 高16位加上低16位
}

export function CLS(val: number, shiftBits: number): number {
    return (val << shiftBits) | (val >>> (32 - shiftBits));
}