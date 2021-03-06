import React, { FormEvent, useEffect, useState, useRef } from "react";
// import { useState } from "react";
import { connect, useDispatch } from "react-redux";
import {
  onCloseModal,
  showCreateAccModal,
  onChangeStatusCreateAccModal,
  openNotification,
  resetStatusAdmin,
} from "../../../redux/actions/index";
import { Form, Input, Button, Select, Upload, message } from "antd";
import { FormInstance } from "antd/lib/form";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
import { Spin, DatePicker, InputNumber } from "antd";
import moment from "moment";
import ReactNumeric from 'react-numeric';
import {
  createCountryRequest,
  fetchDataCountryRequest,
  createTourRequest,
  changeStatusEdit,
  fetchDataPlaceRequest,
  updateInfoTourItemRequest,
} from "../../../redux/actions/index";
import countries from "../../../countries";
import axios from "axios";
const { Option } = Select;
const { RangePicker } = DatePicker;

const ModalTour = (props) => {
  const dispatch = useDispatch();
  const { isDisplay } = props.isDisplay;
  const { match } = props;
  // console.log(" match.params.id", match && match.params && match.params.id);
  const { selectedCountryName, setSelectedCountryName } = useState("");
  const { textareaItem, setTextAreaItem } = useState("");

  const [statusUpload, setStatusUpload] = useState(true);

  const [fileUpload, setFileUpload] = useState("");
  const { history } = props;
  const { loading } = props.loading;
  // const [inputDataRow, setInputDataRow] = useState(null);
  const { dataRow } = props.dataRow;

  const { dataCountry } = props.dataCountry;
  const { dataPlace } = props.dataPlace;
  const { statusEdit } = props.statusEdit;
  const [idCountry, setIdCountry] = useState("");
  const [idPlace, setIdPlace] = useState("");
  const [dateString, setDateString] = useState([]);
  const [tourPrice, setPriceTour] = useState('')
  const [fileImageTour, setFileImage] = useState([])

  const formRef = React.createRef();
  const [form] = Form.useForm();
  const dateFormat = "YYYY-MM-DD";

  const { statusAdmin } = props.statusAdmin;
  const { keyAdminModal } = props.keyAdminModal;
  const { message } = props.message;



  const onChangeImg = e => {
    // for(let i =0;i < e.target.files.length; i++){
    //   fileImageTour.push(e.target.files[i])
    // }
    setFileImage(e.target.files)
  }

  const closeModal = () => {
    dispatch(onCloseModal(false));
    // dispatch(onChangeStatusCreateAccModal(false));
    form.resetFields();
    dispatch(changeStatusEdit());
    history && history.push("/admin/tour");
  };
  const onCreateAccModal = (e) => {
    e.preventDefault();
    dispatch(showCreateAccModal(true));
  };
  const changeStatusCreateAccModal = (e) => {
    e.preventDefault();
    dispatch(onChangeStatusCreateAccModal(false));
  };

  var getIdCountry = (dataCountry, countryName) => {
    var result = -1;
    dataCountry.data.forEach((itemCountry, index) => {
      if (itemCountry.name === countryName) {
        result = itemCountry._id;
      }
    });

    return result;
  };
  var getIdPlace = (dataPlace, placeName) => {
    var result = -1;
    dataPlace.data.forEach((itemPlace, index) => {
      if (itemPlace.name === placeName) {
        result = itemPlace._id;
      }
    });

    return result;
  };

  const handleChangeCountry = (value) => {
    const id = getIdCountry(dataCountry, value);
    setIdCountry(id);
  };
  const handleChangePlace = (value) => {
    const id = getIdPlace(dataPlace, value);
    setIdPlace(id);
  };


  const onReset = () => {
    form.resetFields();
  };
  
  const onChangeDate = (value, dateString) => {
    //   console.log('value', value)
    setDateString(dateString);
  };

  console.log('fileImageTour', fileImageTour)
  const onSubmit = (values) => {

    console.log('dateString[0]', dateString[0])
    console.log('dateString[0]', dateString[1])
    
    // values = {
    //   ...values,
    //   dateString,
    // };
    
    if (statusEdit) {
      dispatch(
        updateInfoTourItemRequest(
          // dataRow.countryId,
          // dataRow.placeId,
          dataRow.key,
          values,
          fileImageTour
        )
      );
    } else {
      dispatch(
        createTourRequest(
          idCountry,
          values.countryName,
          idPlace,
          values.placeName,
          values.tourName,
          dateString[0],
          dateString[1],
          values.price,
          values.memNumber,
          values.description,
          fileImageTour
        )
      );
    }

   
  };

  useEffect(() => {
    if (keyAdminModal !== 0) {
      if (statusAdmin) {
        openNotification(statusAdmin, "Success", message);
        closeModal();
      } else {
        openNotification(statusAdmin, "Failed", message);
        // form.resetFields();
        // dispatch(changeStatusEdit());
      }
    }
    dispatch(resetStatusAdmin());
  }, [statusAdmin, keyAdminModal]);


  const rangeConfig = {
    rules: [{ type: "array", required: true, message: "Please select time!" }],
  };

  const normFile = (e) => {
    // console.log("e", e);
    setFileUpload(e.fileList[0].name);

    if (e.fileList.length >= 2) {
      // setStatusUpload(true)
    } else {
      // setStatusUpload(false)
    }
  };

  const onBlur = () => {
    // console.log("blur");
  };

  const onFocus = () => {
    // console.log("focus");
  };

  const onSearch = (val) => {
    // console.log("search:", val);
  };

  

  const onChangeTextarea = (e) => {
    // console.log('value area', e.target.value)
    // setTextAreaItem(e.target.value)
  };

  const checkInputField = (value) => {
    // var regex = /^[0-9]+$/;
    if (isNaN(value)) {
      return false;
    }
    if (value > 10 || value < 1) {
      return false;
    }
  };

  const onChangeMemNumber = (value) => {
    checkInputField(value);
  };

  // const formatNumber = (number) => {
  //   if(isNaN(number)){
  //     return false
  //   }
  //     if (number < 1000000 || number > 10000000) {
  //       return false;
  //     } 
  //    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      
    
    
  // };

  const onChangePrice = value => {
    // if(value > 10000000 ){
    //   console.log("wrong")
    // }
    // checkInputField(value);
  };

  const onChangePlaceName = (e) => {
    // console.log('value place name', e.target.value)
    // setTextAreaItem(e.target.value)
  };
  const onChangeSelect = (e) => {
    // setSelectItem(e && e.target.value)
  };

  // console.log('selectItem', selectItem)
  // console.log('textareaItem', textareaItem)

  useEffect(() => {
    // console.log("useEffectModalPlace");
    // console.log('dataCountry', dataCountry)
    dispatch(fetchDataCountryRequest());
    dispatch(fetchDataPlaceRequest());
    // const id = match.params.id;
    // console.log("match", match);
    // if (match && id == "8mt43q3kf6") {
    //   // console.log("new");
    // } else {
    //   // console.log("edit");
    // }
  }, [dataRow]);


  return (
    <>

    <script>
      
    </script>
      <div
        className={
          isDisplay ? "wrap-modal country active" : "wrap-modal country"
        }
      >
        <div
          className={
            isDisplay
              ? "modal-form login country active"
              : "modal-form login country"
          }
        >
          <div className="modal-dialog login animated country">
            <div className="modal-content country">
              <div className="modal-header">
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-hidden="true"
                  onClick={closeModal}
                >
                  ×
                </button>
                <h4 className="modal-title"> Create new tour </h4>
              </div>
              <div className="form-country">
                <Spin spinning={loading}>
                  <Form form={form} name="control-hooks" onFinish={onSubmit}>
                    <Form.Item
                      name="countryName"
                      label="Country name"
                      initialValue={statusEdit ? dataRow.countryName : ""}
                      rules={[
                        {
                          required: true,
                          message: "Please select country name !",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Select country name pls"
                        onChange={handleChangeCountry}
                        disabled={statusEdit ? true : false}
                        allowClear
                      >
                        {dataCountry && dataCountry.data
                          ? dataCountry.data.map((item, index) => {
                              return (
                                <Option value={item.name} key={item._id}>
                                  {item.name}
                                </Option>
                              );
                            })
                          : []}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="placeName"
                      label="Place name"
                      initialValue={statusEdit ? dataRow.placeName : ""}
                      rules={[
                        {
                          required: true,
                          message: "Please select place name !",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Select place name pls"
                        onChange={handleChangePlace}
                        disabled={statusEdit ? true : false}
                        allowClear
                      >
                        {dataPlace && dataPlace.data
                          ? dataPlace.data.map((item, index) => {
                              return (
                                <Option value={item.name} key={item._id}>
                                  {item.name}
                                </Option>
                              );
                            })
                          : []}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name="tourName"
                      label="Tour name"
                      onChange={onChangePlaceName}
                      initialValue={statusEdit ? dataRow.tourName : ""}
                      rules={[
                        {
                          required: true,
                          message: "Please typing tour name !",
                        },
                      
                      ]}
                    >
                      <Input
                        placeholder="Typing tour name here..."
                        maxLength={100}
                      />
                    </Form.Item>
                  
                  
                    <Form.Item label="Price">
                      <Form.Item
                        name="price"
                        noStyle
                        initialValue={statusEdit ? dataRow.price : ""}
                        
                        rules={[
                          {
                            pattern: /^(?:\d*)$/,
                            message: "Value should contain just number",
                          },
                       
                        ]}
                      >
                        <InputNumber
                        maxLength={10}
                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                         
                          onChange={onChangePrice}
                        />
                      </Form.Item>
                    </Form.Item>
                    <Form.Item label="Member quantity">
                      <Form.Item
                        name="memNumber"
                        noStyle
                        initialValue={statusEdit ? dataRow.member : ""}
                        rules={[
                          {
                            pattern: /^(?:\d*)$/,
                            message: "Value should contain just number",
                          },
                          {
                            required: true,
                            message:
                              "Member number must be number, not bigger than 10",
                          },
                        ]}
                      >
                        <InputNumber
                          min={1}
                          max={10}
                          onChange={onChangeMemNumber}
                        />
                      </Form.Item>
                    </Form.Item>
                    <Form.Item
                      name="rangePicker"
                      label="Checkin - Checkout"
                      {...rangeConfig}
                    >
                      <RangePicker
                        onChange={onChangeDate}
                        initialValue={
                          statusEdit
                            ? [
                                moment(
                                  statusEdit ? dataRow.checkIn : "",
                                  dateFormat
                                ),
                                moment(
                                  statusEdit ? dataRow.checkOut : "",
                                  dateFormat
                                ),
                              ]
                            : []
                        }
                     
                        format={dateFormat}
                      />
                    </Form.Item>
                    <Form.Item
                      name="description"
                      label="Description"
                      onChange={onChangeTextarea}
                      initialValue={statusEdit ? dataRow.description : ""}
                      rules={[
                        
                        {
                          required: true,
                          message: "Please typing description !",
                        },
                      ]}
                    >
                      <Input.TextArea maxLength={500}  />
                    </Form.Item>

                    <input type="file" onChange={onChangeImg} multiple />
                    
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="btn-ant-modal-submit"
                      >
                        {statusEdit ? "Save" : "Create"}
                      </Button>
                      <Button
                        htmlType="button"
                        className="btn-ant-reset"
                        onClick={() => form.resetFields()}
                      >
                        Reset
                      </Button>
                    </Form.Item>
                  </Form>
                </Spin>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapState = (state) => ({
  isDisplay: state.displayModal,
  statusCreateModal: state.displayModal,
  loading: state.country,
  dataRow: state.tour,
  statusEdit: state.country,
  dataCountry: state.country,
  dataPlace: state.place,
  statusAdmin: state.tour,
  keyAdminModal: state.tour,
  message: state.tour,
});

export default connect(mapState)(ModalTour);
