import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./richTage.scss";

const RichTag: React.FC<any> = ({
  editerDetails,
  setEditerDetails,
  disabled,
}) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    setContent(editerDetails);
  }, [editerDetails]);

  const modules = {
    toolbar: {
      container: [
        ["undo", "redo"],
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        [{ header: [1, 2, 3, 4, 5, 6] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image", "video"],
        [{ align: [] }],
        ["clean"],
      ],
    },
  };

  const formats = [
    "header",
    "undo",
    "redo",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "align",
    "clean",
  ];

  const handleContentChange = (content: string) => {
    setContent(content);
    setEditerDetails(content);
  };

  return (
    <div className="NewRichTag">
      <ReactQuill
        theme="snow"
        value={content}
        onChange={handleContentChange}
        modules={{ ...modules }}
        formats={formats}
        readOnly={disabled}
      />
    </div>
  );
};
export default RichTag;
