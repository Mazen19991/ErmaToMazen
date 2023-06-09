import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { followUser } from "../../../actions/userAction";
import { BASE_PROFILE_IMAGE_URL } from "../../../utils/constants";
import { SHOULD_RE_RENDER } from "../../../constants/postConstants";

const UserListItem = ({ _id, username, avatar }) => {
  const dispatch = useDispatch();

  const [follow, setFollow] = useState(false);

  const handleFollow = () => {
    setFollow(!follow);
    dispatch(followUser(_id));
    dispatch({ type: SHOULD_RE_RENDER });
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex space-x-3 items-center">
        <Link to={`/${username}`}>
          <img
            draggable="false"
            className="w-9 h-9 rounded-full object-cover"
            src={avatar}
            alt="avatar"
          />
        </Link>
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/${username}`}
            className="text-[#5b064a] text-sm font-semibold hover:underline"
          >
            {username}
          </Link>
          <span className="text-gray-400 text-xs">New to ERMA</span>
        </div>
      </div>
      <button
        onClick={handleFollow}
        className={`${
          follow ? "text-red-500" : "text-[#5b064a]"
        } text-xs font-medium`}
      >
        {follow ? "Unfollow" : "Follow"}
      </button>
    </div>
  );
};

export default UserListItem;
