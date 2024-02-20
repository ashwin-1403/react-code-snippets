import React from "react";
import "./NoData.scss";
// import NoDataImg from "../../Assets/images/no-data-image.jpg";
import Card from "react-bootstrap/Card";

export default function NoData(props: any) {
  return (
    <Card>
      <Card.Body>
        <div className="text-center">{props.content}</div>
      </Card.Body>
    </Card>
  );
}
