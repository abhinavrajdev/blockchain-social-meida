import React from "react";
import ReadMoreIcon from "@mui/icons-material/ReadMore";

const Post = ({ imageURL, tagLine, para, uid, postPreview }) => {
  return (
    <div className="w-full flex flex-col gap-6">
      {/* <h1 className="text-slate-300 font-bold tracking-widest">Abhinav Raj</h1> */}
      <img className="w-full" src={imageURL} />
      <div>
        <h1 className="text-[#e7e752] text-xl font-bold tracking-widest">
          {tagLine}
        </h1>
        <h1 className="text-slate-400 pt-1">{para}</h1>
      </div>
      <div className="flex items-center justify-center  ">
        {!postPreview && (
          <a href={"/news/" + uid}>
            <div className="w-fit  cursor-pointer flex gap-1 items-center justify-center ">
              <h1 className="text-slate-300 font-bold tracking-widest">
                {postPreview ? "" : "Read more"}
              </h1>
              <ReadMoreIcon sx={{ color: "grey" }} />
            </div>
          </a>
        )}
      </div>
    </div>
  );
};

export default Post;
