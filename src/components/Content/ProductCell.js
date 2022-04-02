import React, { Component } from "react";
import Cart from "../../assets/shopping-cart.svg";
import {
  AddButton,
  ButtonImg,
  OutOfStock,
  ProductContainer,
  ProductImg,
  ProductName,
  ProductPrice,
  ProductLink,
} from "../styles/Content.style";
import { getProductInfo } from "../../queries";

export default class ProductCell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prodData: {},
      divHover: false,
    };
  }

  setPriceCurrency = (currency) => {
    let amount = 0;
    this.state.prodData.prices.forEach((element) => {
      if (element.currency.symbol === currency) {
        amount = element.amount;
      }
    });
    return `${currency} ${amount}`;
  };

  handleEffect = () =>
    this.setState((prevState) => ({ divHover: !prevState.divHover }));

  async componentDidMount() {
    this.setState({ prodData: await getProductInfo(this.props.id) });
  }

  render() {
    return (
      this.state.prodData.gallery !== undefined && (
        <ProductLink to="/product">
          <ProductContainer
            inStock={this.state.prodData.inStock}
            onMouseEnter={this.handleEffect}
            onMouseLeave={this.handleEffect}
          >
            <ProductImg
              inStock={this.state.prodData.inStock}
              src={this.state.prodData.gallery[0]}
              alt="photo"
            />
            <OutOfStock inStock={this.state.prodData.inStock}>
              Out of stock
            </OutOfStock>
            <ProductName>
              {this.state.prodData["brand"]} {this.state.prodData["name"]}
            </ProductName>
            <ProductPrice>
              {this.setPriceCurrency(this.props.currency)}
            </ProductPrice>
            <AddButton divHover={this.state.divHover}>
              <ButtonImg src={Cart} alt="cart" />
            </AddButton>
          </ProductContainer>
        </ProductLink>
      )
    );
  }
}
