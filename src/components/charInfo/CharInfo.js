import PropTypes from "prop-types";
import "./charInfo.scss";
import Error from "../error/Error";
import Spinner from "../spinner/Spinner";
import Skeleton from "../skeleton/Skeleton";
import MarvelService from "../../services/api";
import { Component } from "react";

class CharInfo extends Component {
  static defaultProps = {
    charId: PropTypes.number,
  };
  state = {
    char: null,
    loading: false,
    error: null,
  };

  marvelApi = new MarvelService();

  componentDidMount() {
    this.updateChar();
  }

  componentDidUpdate(prevProps) {
    if (this.props.charId !== prevProps.charId) {
      this.updateChar();
    }
  }

  onError = () => {
    this.setState({ loading: false, error: true });
  };

  onCharLoading = () => {
    this.setState({ loading: true });
  };

  onCharLoaded = (char) => {
    this.setState({ char, loading: false });
  };

  updateChar = () => {
    const { charId } = this.props;
    if (!charId) return;
    this.onCharLoading();
    this.marvelApi
      .getCharacter(charId)
      .then(this.onCharLoaded)
      .catch(this.onError);
  };
  render() {
    const { char, loading, error } = this.state;
    const skeleton = char || loading || error ? null : <Skeleton />;
    const errorMessage = error ? <Error /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error || !char) ? <View char={char} /> : null;
    return (
      <div className="char__info">
        {skeleton}
        {errorMessage}
        {spinner}
        {content}
      </div>
    );
  }
}

const View = ({ char }) => {
  const { name, description, thumbnail, homepage, wiki, comics } = char;
  return (
    <>
      <div className="char__basics">
        <img
          src={thumbnail}
          alt={name}
          style={
            thumbnail.includes("image_not_available")
              ? { objectFit: "contain" }
              : { objectFit: "cover" }
          }
        />
        <div>
          <div className="char__info-name">{name}</div>
          <div className="char__btns">
            <a href={homepage} className="button button__main">
              <div className="inner">homepage</div>
            </a>
            <a href={wiki} className="button button__secondary">
              <div className="inner">Wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className="char__descr">{description}</div>
      <div className="char__comics">Comics:</div>
      <ul className="char__comics-list">
        {comics.length > 0 ? (
          comics
            .map((com, i) => (
              <li key={i} className="char__comics-item">
                {com.name}
              </li>
            ))
            .slice(0, 10)
        ) : (
          <p>
            There are no comics with this character... Please, select another
            one.
          </p>
        )}
      </ul>
    </>
  );
};
View.propTypes = {
  char: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    thumbnail: PropTypes.string,
    homepage: PropTypes.string,
    wiki: PropTypes.string,
    comics: PropTypes.array,
  }),
};
export default CharInfo;
