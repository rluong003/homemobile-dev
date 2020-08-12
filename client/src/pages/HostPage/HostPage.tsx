import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { Form, Select, Input, InputNumber } from "formik-antd";
import { FormikStepper } from "./FormikStepper";
import { Button, Typography, Upload } from "antd";
import { NEW_LISTING } from "../../lib/graphql/mutations/index";
import {
  NewListingMutation,
  NewListingMutationVariables,
} from "../../lib/graphql/mutations/__generated__/index.generated";
import {
  UploadOutlined,
  HomeOutlined,
  BankOutlined,
  ApartmentOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  SuccessNotification,
  ErrorNotification,
} from "../../components/Notification/Notificaitons";
import { ErrorBanner } from "../../components/Error/Error";
import { ScrollToTop } from "../../index";
import { UploadChangeParam } from "antd/lib/upload";
import { ListingType } from "../../lib/graphql/globalTypes";
import { Viewer } from "../../lib/types";
import { Store } from "antd/lib/form/interface";
import * as Yup from "yup";

interface Props {
  viewer: Viewer;
}

const { Text, Title } = Typography;

const beforeImageUpload = (file: File) => {
  const fileIsValidImage =
    file.type === "image/jpeg" || file.type === "image/png";
  const fileIsValidSize = file.size / 1024 / 1024 < 1;

  if (!fileIsValidImage) {
    ErrorNotification("Images must be in PNG or JPG format");
    return false;
  }

  if (!fileIsValidSize) {
    ErrorNotification("Images must be smaller than 1MB");
    return false;
  }

  return fileIsValidImage && fileIsValidSize;
};

const getBase64Value = (
  img: File | Blob,
  callback: (imageBase64Value: string) => void
) => {
  const reader = new FileReader();
  reader.readAsDataURL(img);
  reader.onload = () => {
    callback(reader.result as string);
  };
};

const validationSchema = Yup.object({
  type: Yup.string().required("Required"),
  numOfGuests: Yup.number()
    .min(1)
    .positive("Please input a number greater than 0")
    .integer(),
  numOfBeds: Yup.number()
    .min(1)
    .positive("Please input a number greater than 0")
    .integer(),
  numOfBedrooms: Yup.number()
    .min(1)
    .positive("Please input a number greater than 0")
    .integer(),
  numOfBathrooms: Yup.number()
    .min(1)
    .positive("Please input a number greater than 0")
    .integer(),
  title: Yup.string().max(45).required("Required"),
  description: Yup.string().max(5000).required("Required"),
  address: Yup.string().required("Required"),
  city: Yup.string().required("Required"),
  state: Yup.string().required("Required"),
  image: Yup.mixed(),
  price: Yup.number()
    .min(1)
    .positive("Please input a number greater than 0")
    .integer(),
});

export const HostPage = ({ viewer }: Props) => {
  ScrollToTop();
  const [imageLoading, setImageLoading] = useState(false);
  const [imageBase64Value, setImageBase64Value] = useState<string>("");
  const [newListing, { loading, data }] = useMutation<
    NewListingMutation,
    NewListingMutationVariables
  >(NEW_LISTING, {
    onCompleted: () => {
      SuccessNotification("Successfully posted your new listing!");
    },
    onError: () => {
      ErrorNotification("Failed to post your listing, try again!");
    },
  });
  const handleImageUpload = (info: UploadChangeParam) => {
    const { file } = info;

    if (file.status === "uploading") {
      setImageLoading(true);
      return;
    }

    if (file.status === "done" && file.originFileObj) {
      getBase64Value(file.originFileObj, (imageBase64Value) => {
        setImageBase64Value(imageBase64Value);
        setImageLoading(false);
      });
    }
  };
  const handleFinish = (values: Store) => {
    const addy = `${values.address}, ${values.city}, ${values.state}`;
    values.image = imageBase64Value;
    const input = {
      address: addy,
      image: imageBase64Value,
      price: values.price,
      description: values.description,
      title: values.title,
      type: values.type,
      numOfBeds: values.numOfBeds,
      numOfGuests: values.numOfGuests,
      numOfBathrooms: values.numOfBathrooms,
      numOfBedrooms: values.numOfBedrooms,
    };

    newListing({ variables: { input } });
  };

  const handleFinishFail = (err: any) => {
    if (err) {
      ErrorNotification("Complete all required fields!");
      return;
    }
  };

  const dummyRequest = ({ file, onSuccess }: any) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  let disableButton = !viewer.id ? true : false;

  if (loading) {
    return (
      <div className="host-layout">
        <div className="host-step-header">
          <Title level={3}>Posting your listing</Title>
          <Text type="secondary">Creating your listing now</Text>
        </div>
      </div>
    );
  }

  if (data && data.newListing) {
    return <Redirect to={`/listing/${data.newListing.id}`} />;
  }

  return (
    <div className="host-layout">
      {disableButton ? (
        <ErrorBanner
          message={"You must be signed in to create a listing"}
          description={"Please sign in"}
        />
      ) : null}
      <FormikStepper
        onSubmit={handleFinish}
        initialValues={{
          type: "",
          numOfGuests: null,
          numOfBeds: null,
          numOfBathrooms: null,
          numOfBedrooms: null,
          title: "",
          description: "",
          address: "",
          city: "",
          state: "",
          image: "",
          price: null,
        }}
        validationSchema={validationSchema}
        handleFinishFail={handleFinishFail}
      >
        <div className="host-step">
          <div className="host-step-header">
            <Title level={3}>What kind of place are you listing?</Title>
            <Text type="secondary">How many guests can you accomodate?</Text>
          </div>

          <Form.Item name="type" label="Home Type" required>
            <Select size="large" name="type" placeholder="Select One">
              <Select.Option value={ListingType.Apartment}>
                <ApartmentOutlined /> <span>Apartment</span>
              </Select.Option>
              <Select.Option value={ListingType.House}>
                <HomeOutlined /> <span>House</span>
              </Select.Option>
              <Select.Option value={ListingType.Room}>
                <BankOutlined /> <span>Room</span>
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="numOfGuests" required label="Max # of Guests">
            <InputNumber name="numOfGuests" min={1} placeholder="4" />
          </Form.Item>
          <Form.Item name="numOfBeds" required label=" # of Beds">
            <InputNumber name="numOfBeds" min={1} placeholder="4" />
          </Form.Item>
          <Form.Item name="numOfBedrooms" required label=" # of Bedrooms">
            <InputNumber name="numOfBedrooms" min={1} placeholder="4" />
          </Form.Item>
          <Form.Item name="numOfBathrooms" required label=" # of Bathrooms">
            <InputNumber name="numOfBathrooms" min={1} placeholder="4" />
          </Form.Item>
        </div>

        <div className="host-step">
          <div className="host-step-header">
            <Title level={3}>Briefly describe your listing</Title>
            <Text type="secondary">
              Try to grab the attention of potential guests with your best
              description!
            </Text>
          </div>

          <Form.Item
            label="Title"
            name="title"
            extra="Max character count of 45"
            required
          >
            <Input
              name="title"
              size="large"
              maxLength={45}
              placeholder="Downtown SF penthouse designed by Raf Simons"
            />
          </Form.Item>

          <Form.Item
            label="Description of listing"
            name="description"
            extra="Max character count of 5000"
            required
          >
            <Input.TextArea
              name="description"
              rows={5}
              maxLength={5000}
              placeholder={`One of a kind designed home located in downtown San Francisco`}
            />
          </Form.Item>
        </div>

        <div className="host-step">
          <div className="host-step-header">
            <Title level={3}>Where's your place located?</Title>
            <Text type="secondary">
              Your address will only be revealed after guests have booked a
              reservation
            </Text>
          </div>

          <Form.Item name="address" label="Address" required>
            <Input
              size="large"
              name="address"
              placeholder="831 Bottom Feeder Lane"
            />
          </Form.Item>

          <Form.Item name="city" label="City/Town" required>
            <Input size="large" name="city" placeholder="Malibu" />
          </Form.Item>

          <Form.Item name="state" label="State/Province" required>
            <Input size="large" name="state" placeholder="California" />
          </Form.Item>
        </div>

        <div className="host-step">
          <div className="host-step-header">
            <Title level={3}>Upload some photos!</Title>
            <Text type="secondary">
              Upload your best photos to show off your beautiful home to guests!
            </Text>
          </div>

          <Form.Item
            label="Image"
            name="image"
            extra="Please upload images under 1MB and in JPG/PNG format"
            required
          >
            <div className="host-image-upload">
              <Upload
                name="image"
                listType="picture-card"
                showUploadList={false}
                customRequest={dummyRequest}
                beforeUpload={beforeImageUpload}
                onChange={handleImageUpload}
              >
                {imageBase64Value ? (
                  <img src={imageBase64Value} alt="newListing" />
                ) : (
                  <div>
                    {imageLoading ? <LoadingOutlined /> : <UploadOutlined />}

                    <div> Upload </div>
                  </div>
                )}
              </Upload>
            </div>
          </Form.Item>

          <Form.Item name="price" label="Price" required>
            <InputNumber size="large" name="price" min={0} placeholder="1000" />
          </Form.Item>

          <div className="host-submit-buttom">
            <Button type="primary" htmlType="submit" disabled={disableButton}>
              Submit
            </Button>
          </div>
        </div>
      </FormikStepper>
    </div>
  );
};
