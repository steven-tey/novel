import type { ImageLoaderProps } from './image-config';
import type { ImageProps, ImageLoader, StaticImageData } from './get-img-props';
import { Image } from '../../client/image-component';
declare const unstable_getImgProps: (imgProps: ImageProps) => {
    props: import("./get-img-props").ImgProps;
};
export default Image;
export { ImageProps, ImageLoaderProps, ImageLoader, StaticImageData, unstable_getImgProps, };
