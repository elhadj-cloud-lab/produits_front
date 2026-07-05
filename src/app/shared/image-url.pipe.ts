import {Pipe, PipeTransform} from '@angular/core';
import {Image} from '../model/image.model';

export function imageToDataUrl(img: Image | null | undefined): string {
  if (!img?.image) return 'assets/default-image.png';
  if (typeof img.image === 'string') return `data:${img.type};base64,${img.image}`;
  if (Array.isArray(img.image)) {
    const base64 = btoa(img.image.map((b: number) => String.fromCharCode(b & 0xff)).join(''));
    return `data:${img.type};base64,${base64}`;
  }
  return 'assets/default-image.png';
}

@Pipe({name: 'imageUrl', standalone: true})
export class ImageUrlPipe implements PipeTransform {
  transform(img: Image | null | undefined): string {
    return imageToDataUrl(img);
  }
}
