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
    page: 1,
  };
  marvelChar = new MarvelService();
  componentDidMount() {
    console.log("mount");
    this.getAllChar();
  }
  onError = () => {
    this.setState({ loading: false, error: true });
  };
  onCharLoaded = (characters) => {
    this.setState({ characters, loading: false });
  };
  getAllChar = () => {
    this.marvelChar
      .getAllCharacters()
      .then(this.onCharLoaded)
      .catch(this.onError);
  };
  render() {
    const { loading, characters, error } = this.state;

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
        <button className="button button__main button__long">
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

export default CharList;
