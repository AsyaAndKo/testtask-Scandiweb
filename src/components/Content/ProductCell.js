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
  ProductInfo,
} from "../styles/ProductCell.style";
import { getProductInfo } from "../../queries";
import { connect } from "react-redux";
import { setCurrentProductID } from "../../redux/ProductID/productID.actions";
import { addProduct } from "../../redux/Cart/cart.actions";

class ProductCell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prodData: { data: [], attributes: {} },
      divHover: false,
    };
  }

  getAllData = async (id) => {
    this.setState({
      prodData: await getProductInfo(id),
    });
  };

  setPriceCurrency = (currency) => {
    let amount = 0;
    this.state.prodData.data.prices.forEach((element) => {
      if (element.currency.symbol === currency) {
        amount = element.amount;
      }
    });
    return `${currency} ${amount}`;
  };

  handleEffect = () =>
    this.setState((prevState) => ({ divHover: !prevState.divHover }));

  handleAddToCart = (product) => {
    this.props.addProduct(product);
  };

  async componentDidMount() {
    await this.getAllData(this.props.id);
  }

  render() {
    return (
      this.state.prodData.data.gallery !== undefined && (
        <ProductContainer
          inStock={this.state.prodData.data.inStock}
          onMouseEnter={this.handleEffect}
          onMouseLeave={this.handleEffect}
          onClick={() => {
            this.props.setCurrentProductID({
              currentProductID: this.state.prodData.data,
            });
          }}
        >
          <ProductLink
            to={`/product/${this.props.id}`}
            onClick={() => {
              this.props.setCurrentProductID({
                currentProductID: this.state.prodData.data,
              });
            }}
          >
            <ProductImg
              cartIsOpen={this.props.cartIsOpen}
              inStock={this.state.prodData.data.inStock}
              src={this.state.prodData.data.gallery[0]}
              alt="photo"
            />
            <OutOfStock inStock={this.state.prodData.data.inStock}>
              Out of stock
            </OutOfStock>
            <ProductInfo>
              <ProductName>
                {this.state.prodData.data["brand"]}{" "}
                {this.state.prodData.data["name"]}
              </ProductName>
              <ProductPrice>
                {this.setPriceCurrency(this.props.currentCurrency)}
              </ProductPrice>
            </ProductInfo>
          </ProductLink>
          <AddButton
            divHover={this.state.divHover}
            inStock={this.state.prodData.data.inStock}
            onClick={() => {
              this.handleAddToCart(this.state.prodData);
              this.props.setCurrentProductID({
                currentProductID: this.state.prodData.data,
              });
            }}
          >
            <ButtonImg src={Cart} alt="cart" />
          </AddButton>
        </ProductContainer>
      )
    );
  }
}

const mapStateToProps = ({
  currentCurrency,
  currentProductID,
  cartIsOpen,
  cartData,
}) => ({
  currentCurrency: currentCurrency.currentCurrency,
  currentProductID: currentProductID.currentProductID,
  cartIsOpen: cartIsOpen.cartIsOpen,
  cartData: cartData.cartData,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentProductID: (currentProductID) =>
    dispatch(setCurrentProductID(currentProductID)),
  addProduct: (cartData) => dispatch(addProduct(cartData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductCell);
