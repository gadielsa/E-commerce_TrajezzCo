import { createContext } from "react";
import {products} from "../assets/assets";

export const shopContext = createContext()

const shopContextProvider = (props) => {

  const currency = 'R$';
  const delivery_fee = 10;

  const value = {
    products, currency, delivery_fee
  }
  

  return (
    <shopContext.Provider value={value}>
      {props.children}
    </shopContext.Provider>
  )

}

export default shopContextProvider