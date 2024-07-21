export interface IHall {
  _id: string;
  name: string;
  location: string;
  images: IImage[];
}

export interface IImage {
  name: string;
  type: string;
  uri: string;
}
