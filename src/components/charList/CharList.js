import PropTypes from "prop-types";
import { Component } from "react";
import Spinner from "../spinner/Spinner";
import MarvelService from "../../services/api";
import Error from "../error/Error";
import "./charList.scss";

class CharList extends Component {
  static defaultProps = {
    onCharSelected: PropTypes.func,
  };
  state = {
    characters: [],
    loading: true,
    onError: null,
    newItemLoading: false,
    offset: 210,
    charEnded: false,
  };
  marvelChar = new MarvelService();
  componentDidMount() {
    this.onRequest();
  }
  onRequest = (offset) => {
    this.onCharListLoading();
    this.marvelChar
      .getAllCharacters(offset)
      .then(this.onCharLoaded)
      .catch(this.onError);
  };

  onCharListLoading = () => {
    this.setState({
      newItemLoading: true,
    });
  };

  onError = () => {
    this.setState({ loading: false, error: true });
  };

  onCharLoaded = (newCharacters) => {
    let ended = false;
    if (newCharacters.length < 9) {
      ended = true;
    }
    this.setState(({ characters, offset, charEnded }) => ({
      characters: [...characters, ...newCharacters],
      loading: false,
      newItemLoading: false,
      offset: offset + 9,
      charEnded: ended,
    }));
  };

  itemRefs = [];

  setRef = (ref) => {
    this.itemRefs.push(ref);
  };
  onSelectedRef = (id) => {
    this.itemRefs.forEach((item) =>
      item.classList.remove("char__item_selected")
    );
    this.itemRefs[id].classList.add("char__item_selected");
  };
  render() {
    const { loading, characters, error, newItemLoading, offset, charEnded } =
      this.state;

    const errorMessage = error ? <Error /> : null;
    const spinner = loading ? <Spinner /> : null;
    return (
      <div className="char__list">
        {errorMessage}
        {spinner}
        {!(loading || error) ? (
          <ul className="char__grid">
            {characters.map((char, i) => (
              <li
                key={char.id}
                ref={this.setRef}
                onClick={() => {
                  this.props.onCharSelected(char.id);
                  this.onSelectedRef(i);
                }}
                className="char__item"
              >
                <img
                  src={char.thumbnail}
                  alt={char.name}
                  style={
                    char.thumbnail.includes("image_not_available")
                      ? { objectFit: "unset" }
                      : { objectFit: "cover" }
                  }
                />
                <div className="char__name">{char.name}</div>
              </li>
            ))}
          </ul>
        ) : null}
        <button
          onClick={() => this.onRequest(offset)}
          disabled={newItemLoading}
          style={{ display: charEnded ? "none" : "block" }}
          className="button button__main button__long"
        >
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

export default CharList;
