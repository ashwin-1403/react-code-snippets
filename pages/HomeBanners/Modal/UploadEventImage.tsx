import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./UploadEventImage.style.scss";
import { useState } from "react";
import ImageCropper from "../../../Component/PopWIndow/imageCropper";
import getCroppedImg from "../../../Component/PopWIndow/cropImage";
import { ToastFailure, ToastSuccess } from "../../../Share/toast/ToastMsg";
import useApiService from "../../../Utills/ApiAxiosHandler/ApiAxiosHandler";
import { ClipLoader } from "react-spinners";

function UploadEventImage(props: any) {
  const axiosInstance = useApiService();
  const { setCroppedBannerCloud } = props;
  const [showImage, setShowImage] = useState<any>({
    bytes: "",
    file: props.imageURL || "",
  });
  const [bannerCropImage, setBannerCropImage] = useState<any>();

  const [loading, setLoading] = useState(false);

  const handleImagesShow = (event: any) => {
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
      axiosInstance
        .post(`s3/upload-file`, {
          contentType: showImage.bytes.type,
          image: croppedImage,
        })
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
      ToastFailure(
        "Please choose the image. If its already selected, undo/delete the selection, and then choose the image again"
      );
    }
  };

  return (
    <Modal
      {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="HomeBannerPopup"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <div className="imageLoderSec">
            BANNER IMAGE {loading && <ClipLoader color="#ff2851" size={25} />}
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="image-crope-container">
          <div className="crop-image-upload">
            <div className="image-size-title">
              <p className="images-size">BANNER IMAGE (2000 * 530)</p>
              <div className="import-image-section">
                {showImage.file ? (
                  <>
                    <ImageCropper
                      image={showImage.file}
                      aspect={2000 / 530}
                      croppedArea={(data: any) => setBannerCropImage(data)}
                      containerStyle={{
                        width: "28.6%",
                        height: "216px",
                        top: "23px",
                        left: "377px",
                        margin: "30px",
                        backgroundColor: "#fff",
                        overflow: "hidden",
                      }}
                    />
                  </>
                ) : (
                  <>
                    <div className="import-crop-image">
                      <div className="iamges-selector">
                        <input
                          type="file"
                          name="uploadImage"
                          className="selecting-images-upload"
                          accept="image/*"
                          onChange={(event) => handleImagesShow(event)}
                        />
                        <label htmlFor="/" className="Drage-&-drop">
                          Click to import or Drag & Drop
                        </label>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="button-Section">
                <div className="buttons-undo-redo-crop">
                  <div className="undo-button"></div>
                  <div className="undo-button">
                    <button className="undo" onClick={() => setShowImage([])}>
                      UNDO
                    </button>
                  </div>
                  <div className="undo-button">
                    <button className="undo" onClick={() => setShowImage([])}>
                      DELETE
                    </button>
                  </div>
                  <div className="undo-button">
                    <button
                      className="undo"
                      onClick={() => cropBannerImage()}
                      disabled={loading}
                    >
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
        <Button onClick={props.onHide} className="done-btn" disabled={loading}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UploadEventImage;
