export interface IHall {
  _id: string;
  name: string;
  description: string;
  location: string;
  capacity: string;
  available: boolean;
  images: IImage[];
}

export interface IImage {
  name: string;
  type: string;
  uri: string;
}

export interface IBookQuery {
  bookedFrom: Date | string;
  bookedTo: Date | string;
  duration: string;
}
