import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addComment, likePost, savePost } from "../../actions/postAction";
import { likeFill } from "../Navbar/SvgIcons";
import {
  commentIcon,
  emojiIcon,
  likeIconOutline,
  moreIcons,
  saveIconFill,
  saveIconOutline,
  shareIcon,
} from "./SvgIcons";
import { Picker } from "emoji-mart";
import ScrollToBottom from "react-scroll-to-bottom";
import axios from "axios";
import moment from "moment";
import logo from "../../assests/images/logo.png";
import PetsIcon from "@mui/icons-material/Pets";

const PostItem = ({
  _id,
  caption,
  likes,
  comments,
  image,
  tags,
  postedBy,
  savedBy,
  createdAt,
  setUsersDialog,
  setUsersList,
  allTags,
}) => {
  const dispatch = useDispatch();
  const commentInput = useRef(null);

  const { user } = useSelector((state) => state.user);
  // const { loading, post } = useSelector((state) => state.postDetails);

  const [allLikes, setAllLikes] = useState(likes);
  const [allComments, setAllComments] = useState(comments);
  const [allSavedBy, setAllSavedBy] = useState(savedBy);

  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [comment, setComment] = useState("");
  const [viewComment, setViewComment] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);

  const [likeEffect, setLikeEffect] = useState(false);

  const handleLike = async () => {
    setLiked(!liked);
    await dispatch(likePost(_id));
    const { data } = await axios.get(`/api/v1/post/detail/${_id}`);
    setAllLikes(data.post.likes);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    await dispatch(addComment(_id, comment));
    setComment("");
    const { data } = await axios.get(`/api/v1/post/detail/${_id}`);
    setAllComments(data.post.comments);
  };

  const handleSave = async () => {
    setSaved(!saved);
    await dispatch(savePost(_id));
    const { data } = await axios.get(`/api/v1/post/detail/${_id}`);
    setAllSavedBy(data.post.savedBy);
  };

  const handleLikeModal = () => {
    setUsersDialog(true);
    setUsersList(allLikes);
  };

  const setLike = () => {
    setLikeEffect(true);
    setTimeout(() => {
      setLikeEffect(false);
    }, 500);
    if (liked) {
      return;
    }
    handleLike();
  };

  useEffect(() => {
    setLiked(allLikes.some((u) => u._id === user._id));
  }, [allLikes]);

  useEffect(() => {
    setSaved(allSavedBy.some((id) => id === user._id));
  }, [allSavedBy]);

  return (
    <div
      style={{ backgroundImage: "white" }}
      className="flex flex-col border rounded bg-white relative shadow-md"
    >
      <div className="flex justify-between px-3 py-2.5 border-b items-center">
        <div className="flex space-x-3 items-center">
          <Link to={`/${postedBy.username}`}>
            <img
              draggable="false"
              className="w-10 h-10 rounded-full"
              src={postedBy.avatar}
              alt="avatar"
            />
          </Link>
          <Link
            to={`/${postedBy.username}`}
            className="text-sm font-semibold text-[#5b064a]"
          >
            {postedBy.username}
          </Link>
        </div>
        <span className="cursor-pointer">{moreIcons}</span>
      </div>

      {/* post image container */}
      <div
        className="relative flex items-center justify-center w-full h-full"
        style={{ borderRadius: 25 }}
        onDoubleClick={setLike}
      >
        <img
          style={{ padding: 30, backgroundColor: "white", borderRadius: 5 }}
          draggable="false"
          loading="lazy"
          className="w-full h-full object-full object-center"
          src={image}
          alt="post image"
        />
        {likeEffect && (
          <PetsIcon
            style={{ color: "#d30aa8", height: "5em" }}
            className="likeEffect"
          />
        )}
      </div>

      {/* like comment container */}
      <div className="flex flex-col px-4 space-y-1 border-b pb-2 mt-2">
        {/* icons container */}
        <div className="flex items-center justify-between py-2 text-[#5b064a]">
          <div className="flex space-x-4">
            <button onClick={handleLike}>
              {liked ? likeFill : likeIconOutline}
            </button>
            <button onClick={() => commentInput.current.focus()}>
              {commentIcon}
            </button>
            {/* {shareIcon} */}
            <button onClick={handleSave}>
              {saved ? saveIconFill : saveIconOutline}
            </button>
          </div>
        </div>
        {/* Tags */}
        <span className="italic text-sm">
          {tags !== undefined
            ? tags
                .map((t) => {
                  return "#" + t.name;
                })
                .join(" ")
            : allTags &&
              allTags
                .map((t) => {
                  return "#" + t.name;
                })
                .join(" ")}
        </span>
        {/* likes  */}
        <span
          onClick={handleLikeModal}
          className="font-semibold text-sm cursor-pointer text-[#5b064a]"
        >
          {allLikes.length} likes
        </span>

        {/* comment */}
        <div className="flex flex-auto items-center space-x-1 text-[#5b064a]">
          <Link
            to={`/${postedBy.username}`}
            className="text-sm font-semibold hover:underline"
          >
            {postedBy.username}
          </Link>
          <span className="text-sm text-[#5b064a]">{caption}</span>
        </div>

        {/* time */}
        {allComments.length > 0 ? (
          <span
            onClick={() => setViewComment(!viewComment)}
            className="text-[13px] text-gray-500 cursor-pointer"
          >
            {viewComment
              ? "Hide Comments"
              : allComments.length === 1
              ? `View ${allComments.length} Comment`
              : `View All ${allComments.length} Comments`}
          </span>
        ) : (
          <span className="text-[13px] text-gray-500">No Comments Yet!</span>
        )}
        <span className="text-xs text-gray-500 cursor-pointer">
          {moment(createdAt).fromNow()}
        </span>

        {viewComment && (
          <ScrollToBottom className="w-full h-52 overflow-y-auto py-1">
            {allComments.map((c) => (
              <div className="flex items-start mb-2 space-x-2" key={c._id}>
                <img
                  draggable="false"
                  className="h-7 w-7 rounded-full object-cover mr-0.5"
                  src={c.user.avatar}
                  alt="avatar"
                />
                <Link
                  to={`/${c.user}`}
                  className="text-sm font-semibold hover:underline"
                >
                  {c.user.username}
                </Link>
                <p className="text-sm">{c.comment}</p>
              </div>
            ))}
          </ScrollToBottom>
        )}
      </div>

      {/* comment input container */}
      <form
        onSubmit={handleComment}
        className="flex items-center justify-between p-3 w-full space-x-3"
      >
        <span
          onClick={() => setShowEmojis(!showEmojis)}
          className="cursor-pointer"
        >
          {emojiIcon}
        </span>

        {showEmojis && (
          <div className="absolute bottom-12 -left-2">
            <Picker
              set="google"
              onSelect={(e) => setComment(comment + e.native)}
              title="Emojis"
            />
          </div>
        )}

        <input
          className="flex-auto text-sm outline-none border-none bg-transparent"
          type="text"
          value={comment}
          ref={commentInput}
          required
          onFocus={() => setShowEmojis(false)}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button
          type="submit"
          className={`${
            comment.trim().length < 1 ? "text-[#5b064a]" : "text-[#5b064a]"
          } text-sm font-semibold`}
          disabled={comment.trim().length < 1}
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default PostItem;
