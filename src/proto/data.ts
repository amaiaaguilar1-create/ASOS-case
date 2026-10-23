export const img = (id: string) =>
  `https://images.unsplash.com/${id}?w=600&h=800&fit=crop&q=75`;

export type Dress = {
  id: string;
  brand: string;
  name: string;
  price: number;
  size: string;
  image: string;
};

export const DRESSES = {
  d1: {
    id: "d1",
    brand: "ASOS DESIGN",
    name: "Strapless satin column wedding dress in ivory",
    price: 160,
    size: "UK 12",
    image: img("photo-1615164631286-c9a3fd24e3ad"),
  },
  d2: {
    id: "d2",
    brand: "Six Stories",
    name: "Bridal lace slip maxi dress in white",
    price: 119,
    size: "UK 10",
    image: img("photo-1534875756527-5e8e4392005f"),
  },
  d3: {
    id: "d3",
    brand: "ASOS EDITION",
    name: "Lace long sleeve open back wedding dress in ivory",
    price: 250,
    size: "UK 10",
    image: img("photo-1585241920473-b472eb9ffbae"),
  },
  x1: {
    id: "x1",
    brand: "ASOS DESIGN",
    name: "Cowl neck satin maxi wedding dress in ivory",
    price: 95,
    size: "UK 12",
    image: img("photo-1548313093-370cf4ba3892"),
  },
  x2: {
    id: "x2",
    brand: "Y.A.S Bridal",
    name: "Tulle off-shoulder wedding dress in ivory",
    price: 210,
    size: "UK 12",
    image: img("photo-1594816935907-1e8f03b98437"),
  },
  x3: {
    id: "x3",
    brand: "ASOS EDITION",
    name: "Embellished sheer sleeve wedding dress in ivory",
    price: 300,
    size: "UK 12",
    image: img("photo-1622277430358-f4d134452e2e"),
  },
} as Record<string, Dress>;

export const LISTING = ["d1", "d2", "d3", "x1", "x2", "x3"];
export const SAVED = ["d1", "d2", "d3"];
export const SIZES = ["UK 6", "UK 8", "UK 10", "UK 12", "UK 14", "UK 16", "UK 18", "UK 20"];
export const OUT_OF_STOCK = ["UK 6", "UK 20"];

export const gbp = (n: number) => `£${n.toFixed(2)}`;

export const dress = (id: string | undefined): Dress => {
  const found = DRESSES[id ?? "d1"] ?? DRESSES["d1"];
  if (!found) throw new Error("Missing demo dress");
  return found;
};
export const shortName = (id: string) => ({ d1: "Strapless satin column", d2: "Bridal lace slip maxi", d3: "Lace long sleeve open back" })[id] ?? dress(id).name;
