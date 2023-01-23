import { Component } from "react";
import Spinner from "../spinner/Spinner";
import MarvelService from "../../services/api";
import Error from "../error/Error";
import "./charList.scss";

class CharList extends Component {
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
            {characters.map((char) => (
              <li
                key={char.id}
                onClick={() => this.props.onCharSelected(char.id)}
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
