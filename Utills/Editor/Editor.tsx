import React, { useRef } from "react";
import JoditEditor from "jodit-react";
import "./editor.style.scss";

interface IProps {
  editerDetails: {
    content: string;
    contentLength: string;
  };
  setEditerDetails: React.Dispatch<
    React.SetStateAction<{
      content: string;
      contentLength: string;
    }>
  >;
}

const MyEditer: React.FC<IProps> = ({ editerDetails, setEditerDetails }) => {
  const editor = useRef<any>(null);

  const onBlurEditor = () => {
    setEditerDetails({
      ...editerDetails,
      content: editor?.current?.value,
    });
  };
  // const maxLength = 10;

  // const editorConfig = {
  //   maxLength: maxLength,
  // };

  const onEditorChange = (editorNewValue: string) => {
    // const parser = new DOMParser();
    // const parsedContent = parser.parseFromString(editorNewValue, "text/html");
    // const plainTextContent = parsedContent.body.textContent || "";
    // console.log(plainTextContent , plainTextContent.length)
    // if (editor?.current?.value?.length <= 50) {
      setEditerDetails({
        ...editerDetails,
        contentLength: editorNewValue,
        content: editor?.current?.value,
      });
    // }
  };

  return (
    <div className="RichTextSec">
      <JoditEditor
        ref={editor}
        value={editerDetails.content}
        onBlur={onBlurEditor}
        onChange={onEditorChange}
      // limitChars={100}
      // config={{ ...editorConfig}}
      />
    </div>
  );
};

export default MyEditer;
