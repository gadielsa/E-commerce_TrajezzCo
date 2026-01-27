import jezz_logo from './jezz_logo.png'
import search_icon from './search_icon.png'
import user from './user.png'
import shopping_bag from './shopping_bag.png'
import menu_icon from './menu_icon.png'
import back_arrow from './back_arrow.png'
import sneaker_example from './sneaker_example.png'
import exchange_icon from './exchange_icon.png'
import headset_icon from './headset_icon.png'
import circle_check_icon from './circle_check_icon.png'
import cross_icon from './cross_icon.png'
import bin_icon from './bin_icon.png'
import pix_logo from './pix_logo.png'

export const assets = {
  jezz_logo,
  search_icon,
  user,
  shopping_bag,
  menu_icon,
  back_arrow,
  sneaker_example,
  exchange_icon,
  headset_icon,
  circle_check_icon,
  cross_icon,
  bin_icon,
  pix_logo

}

export const products = [
  {
    _id: "aaaaa",
    name: "TÊNIS AIR MAX 97",
    description: "Tênis Nike Air Max 97 Masculino - O clássico que revolucionou o design dos tênis de corrida com sua estética inspirada em ondas e linhas futuristas. Com amortecimento visível em toda a extensão do solado, oferece conforto excepcional para o dia a dia.",
    price: 349.93,
    image: [sneaker_example],
    category: "Sneaker",
    subCategory: "Premium",
    sizes: ["P", "M", "G", "GG"],
    date: 1234567890000,
    bestseller: true
  },
  {
    _id: "bbbbb",
    name: "JORDAN 1 RETRO HIGH",
    description: "O icônico Jordan 1 com design atemporal, combining style e performance. Perfeito para colecionadores e fãs de sneakers.",
    price: 499.90,
    image: [sneaker_example],
    category: "Sneaker",
    subCategory: "Premium",
    sizes: ["P", "M", "G", "GG"],
    date: 1234567890001,
    bestseller: true
  },
  {
    _id: "ccccc",
    name: "ADIDAS ULTRABOOST",
    description: "Tecnologia Boost para conforto incomparável. Ideal para corrida e uso casual.",
    price: 420.00,
    image: [sneaker_example],
    category: "Sports",
    subCategory: "Running",
    sizes: ["P", "M", "G"],
    date: 1234567890002,
    bestseller: false
  },
  {
    _id: "ddddd",
    name: "CONVERSE CHUCK TAYLOR",
    description: "Clássico atemporal da Converse. Confortável e versátil para qualquer estilo.",
    price: 179.90,
    image: [sneaker_example],
    category: "Casual",
    subCategory: "Skate",
    sizes: ["P", "M", "G", "GG"],
    date: 1234567890003,
    bestseller: true
  },
  {
    _id: "eeeee",
    name: "NIKE DUNK LOW",
    description: "O Dunk Low clássico com design renovado. Perfeito para fãs de streetwear.",
    price: 379.90,
    image: [sneaker_example],
    category: "Sneaker",
    subCategory: "Lifestyle",
    sizes: ["P", "M", "G", "GG"],
    date: 1234567890004,
    bestseller: true
  },
  {
    _id: "fffff",
    name: "PUMA RS-X ULTRA",
    description: "Design bold e cores vibrantes. A escolha perfeita para quem quer se destacar.",
    price: 289.90,
    image: [sneaker_example],
    category: "Casual",
    subCategory: "Lifestyle",
    sizes: ["P", "M", "G"],
    date: 1234567890005,
    bestseller: false
  },
  {
    _id: "ggggg",
    name: "NIKE AIR FORCE 1",
    description: "O clássico que nunca sai de moda. Lançado em 1982, continua sendo o favorito.",
    price: 299.90,
    image: [sneaker_example],
    category: "Casual",
    subCategory: "Lifestyle",
    sizes: ["P", "M", "G", "GG"],
    date: 1234567890006,
    bestseller: true
  },
  {
    _id: "hhhhh",
    name: "NEW BALANCE 990V6",
    description: "Conforto premium com design clássico. Ideal para o dia a dia.",
    price: 439.90,
    image: [sneaker_example],
    category: "Sports",
    subCategory: "Running",
    sizes: ["P", "M", "G"],
    date: 1234567890007,
    bestseller: false
  },
  {
    _id: "iiiii",
    name: "VANS OLD SKOOL",
    description: "Skate clássico com detalhes icônicos. Versátil e durável.",
    price: 219.90,
    image: [sneaker_example],
    category: "Casual",
    subCategory: "Skate",
    sizes: ["P", "M", "G", "GG"],
    date: 1234567890008,
    bestseller: true
  },
  {
    _id: "jjjjj",
    name: "ASICS GEL-LYTE III",
    description: "Tecnologia de amortecimento avançada com design futurista.",
    price: 359.90,
    image: [sneaker_example],
    category: "Sports",
    subCategory: "Running",
    sizes: ["P", "M", "G"],
    date: 1234567890009,
    bestseller: false
  }
]