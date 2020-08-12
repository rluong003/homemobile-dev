/* eslint-disable no-template-curly-in-string */
import React, { useState } from "react";
import { Formik, FormikConfig, FormikValues } from "formik";
import { Form } from "formik-antd";
import { Button } from "antd";

interface Props {
  handleFinishFail: (err: any) => void;
}

export function FormikStepper({
  children,
  handleFinishFail,
  ...props
}: FormikConfig<FormikValues> & Props) {
  const childrenArr = React.Children.toArray(children);
  const [step, SetStep] = useState(0);
  const currentChild = childrenArr[step];

  const isLastStep = () => {
    return step === childrenArr.length - 1;
  };

  return (
    <Formik {...props}>
      <Form
        size="large"
        className="host-form"
        layout="vertical"
        onFinishFailed={handleFinishFail}
      >
        {currentChild}

        <div className="host-step-buttons-wrapper">
          <div className="host-left-button">
            {step > 0 ? (
              <Button onClick={() => SetStep(step - 1)}> Back </Button>
            ) : null}
          </div>

          <div className="host-right-button">
            {!isLastStep() ? (
              <Button onClick={() => SetStep(step + 1)}> Next </Button>
            ) : null}
          </div>
        </div>
      </Form>
    </Formik>
  );
}
