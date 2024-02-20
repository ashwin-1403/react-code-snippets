import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./UploadEventImage.style.scss";
import { useState } from "react";
import axios from "axios";
import ImageCropper from "../../../Component/PopWIndow/imageCropper";
import getCroppedImg from "../../../Component/PopWIndow/cropImage";
import { ToastFailure, ToastSuccess } from "../../../Share/toast/ToastMsg";
import { ClipLoader } from "react-spinners";

function UploadEventImage(props) {
  const { setCroppedBannerCloud } = props;
  const [showImage, setShowImage] = useState({ bytes: "", file: props.imageURL });
  const [bannerCropImage, setBannerCropImage] = useState();
  const [loading, setLoading] = useState(false);

  const handleImagesShow = (event) => {
    setShowImage({
      bytes: event.target.files[0],
      file: URL.createObjectURL(event.target.files[0]),
    });
  };

  const cropBannerImage = async () => {
    if (showImage?.bytes) {
      if (!showImage?.bytes?.type?.includes("image")) {
        ToastFailure("Please upload valid image file");
        return;
      }
      setLoading(true);
      const croppedImage = await getCroppedImg(showImage.file, bannerCropImage);
      axios
        .post(
          `${process.env.REACT_APP_API_BASE_URL}s3/upload-file`,
          {
            contentType: showImage.bytes.type,
            image: croppedImage,
          },
          {
            headers: {
              Authorization: localStorage.getItem("AUTHTOKEN") || "",
            },
          }
        )
        .then((response) => {
          setLoading(false);
          if (response.data.status) {
            setCroppedBannerCloud(response?.data?.data?.imageUrl);
            props.onHide();
            ToastSuccess("Image uploaded successfully.");
          } else {
            ToastFailure(response?.data?.error);
          }
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
    } else {
      ToastFailure("Please choose the image. If its already selected, undo/delete the selection, and then choose the image again");
    }
  };

  return (
    <Modal
      {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <div className="imageLoderSec">
            SPONSOR IMAGE {loading && <ClipLoader color="#ff2851" size={25} />}
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="image-crope-container">
          <div className="crop-image-upload">
            <div className="image-size-title">
              <p className="images-size">SPONSOR IMAGE (335 * 155)</p>
              <div className="import-image-section SponsorImageCropper">
                {showImage.file ? (
                  <ImageCropper
                    image={showImage.file}
                    aspect={355 / 155}
                    croppedArea={(data) => setBannerCropImage(data)}
                    containerStyle={{
                      width: "29%",
                      height: "216px",
                      top: "23px",
                      left: "377px",
                      margin: "30px",
                      backgroundColor: "#fff",
                      overflow: "hidden",
                    }}
                  />
                ) : (
                  <div className="import-crop-image">
                    <div className="iamges-selector">
                      <input
                        type="file"
                        name="uploadImage"
                        className="selecting-images-upload"
                        accept="image/*"
                        onChange={(event) => handleImagesShow(event)}
                      />
                      <div htmlFor="/" type="file" className="Drage-&-drop">
                        Click to import or Drag & Drop
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="button-Section">
                <div className="buttons-undo-redo-crop">
                  <div className="undo-button">
                    <button
                      className="undo"
                      onClick={() => {
                        setShowImage([])
                      }}
                    >
                      UNDO
                    </button>
                  </div>
                  <div className="undo-button">
                    <button className="undo" onClick={() => {
                      setShowImage([])
                    }}>
                      DELETE
                    </button>
                  </div>
                  <div className="undo-button">
                    <button className="undo" onClick={() => cropBannerImage()} disabled={loading}>
                      CROP & UPLOAD
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide} className="done-btn">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal >
  );
}

export default UploadEventImage;
