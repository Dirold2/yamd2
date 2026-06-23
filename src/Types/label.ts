export type Label = {
  id: number;
  name: string;
  description?: string;
  descriptionFormatted?: string;
  image?: string;
  links?: Array<{ title: string; href: string; type: string; socialNetwork: string }>;
  type?: string;
};

export type LabelAlbumsResponse = {
  pager: { page: number; pageSize: number; total: number };
  albums: import("./album.js").Album[];
};

export type LabelArtistsResponse = {
  pager: { page: number; pageSize: number; total: number };
  artists: import("./artist.js").Artist[];
};
