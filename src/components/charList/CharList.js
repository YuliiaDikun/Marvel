import { Component } from "react";
import Spinner from "../spinner/Spinner";
import MarvelService from "../../services/api";
import Error from "../error/Error";
import "./charList.scss";
import abyss from "../../resources/img/abyss.jpg";

class CharList extends Component {
  state = {
    characters: [],
    loading: true,
    onError: null,
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
    const content = !(loading || error) ? (
      <Char characters={characters} />
    ) : null;
    return (
      <div className="char__list">
        {errorMessage}
        {spinner}
        {content}
        <button className="button button__main button__long">
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

export default CharList;

const Char = ({ characters }) => {
  return (
    <ul className="char__grid">
      {characters.map((char) => (
        <li key={char.name} className="char__item">
          <img
            src={char.thumbnail}
            alt={char.name}
            style={
              char.thumbnail.includes("image_not_available")
                ? { objectFit: "contain" }
                : { objectFit: "cover" }
            }
          />
          <div className="char__name">{char.name}</div>
        </li>
      ))}
    </ul>
  );
};
