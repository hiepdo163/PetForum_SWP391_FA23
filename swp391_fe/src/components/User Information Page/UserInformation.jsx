import React from 'react';
import { useState, useEffect } from "react";
import './UserInformation.css';
import { Container, Row, Col, Image, Button, ProgressBar, Tabs, Tab, Table } from 'react-bootstrap';
import { FaCheckCircle, FaStar, FaStarO, FaTruck, FaComment, FaTasks, FaEnvelope, FaEdit } from 'react-icons/fa';
import { fetchUserProfile } from "../../api/user/userApi";
import { useNavigate } from "react-router-dom";
import { Post } from "../Post";


function UserInformation() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "#unknown",
        lastName: "#unknown",
        email: "#unknown",
        phone: "#unknown",
        gender: "#unknown",
        bio: "who am i?",
    });
    const userId = sessionStorage.getItem("someoneUserId");
    useEffect(() => {
        if (userId) {
            fetchDataFromAPI(userId);
        }
    }, []);

    const fetchDataFromAPI = async (userId) => {
        try {
            const res = await fetchUserProfile(userId);
            const userData = {
                firstName: res.firstName || "",
                lastName: res.lastName || "",
                email: res.email || "",
                phone: res.phoneNumber || "",
                gender: res.gender === null ? "" : res.gender ? "Male" : "Female",
                bio: res.bio || "who am i?",
            };
            setFormData(userData); // Trả về thông tin người dùng
        } catch (error) {
            console.log(error);
            return null; // Trả về null trong trường hợp lỗi
        }
    };

    // Giả sử API trả về số lượng orders và posts
    const orders = 456;
    const posts = 1000;
    const total =1000;

    return (
        <Container className="bootdeys">
            <Row id="user-profile">
                <Col lg={3} md={4} sm={4}>
                    <div className="main-box clearfix">
                        <h2>
                            {formData.firstName + " " + formData.lastName}
                        </h2>
                        <Image
                            src="https://bootdey.com/img/Content/avatar/avatar1.png"
                            alt=""
                            className="profile-img img-responsive center-block"
                        />
                        <div className="profile-stars">
                            <span>Super User</span>
                        </div>
                        <div className="profile-since">
                            Member since: Jan 2012
                        </div>
                        {/* Thêm thanh trượt vào đây */}
                        <ProgressBar striped animated variant="success" now={orders} label={`${orders} Orders`} max={total} />
                        <ProgressBar striped animated variant="info" now={posts} label={`${posts} Posts`} max={total} />
                        <div className="profile-message-btn center-block text-center">
                            <Button variant="success">
                                <FaEnvelope /> Send message
                            </Button>
                        </div>
                    </div>
                </Col>
                <Col lg={9} md={8} sm={8}>
                    <div className="main-box clearfix">
                        <div className="profile-header">
                            <h3><span>User info</span></h3>
                            <Button variant="primary" className="edit-profile">
                                Edit profile
                            </Button>
                        </div>

                        <div className="profile-user-info">
                            <Col sm={8}>
                                <div className="profile-user-details clearfix">
                                    <div className="profile-user-details-label">
                                        First Name
                                    </div>
                                    <div className="profile-user-details-value">
                                        {formData.firstName}
                                    </div>
                                </div>
                                <div className="profile-user-details clearfix">
                                    <div className="profile-user-details-label">
                                        Last Name
                                    </div>
                                    <div className="profile-user-details-value">
                                        {formData.lastName}
                                    </div>
                                </div>
                                <div className="profile-user-details clearfix">
                                    <div className="profile-user-details-label">
                                        Gender
                                    </div>
                                    <div className="profile-user-details-value">
                                        {formData.gender}
                                    </div>
                                </div>
                                <div className="profile-user-details clearfix">
                                    <div className="profile-user-details-label">
                                        Email
                                    </div>
                                    <div className="profile-user-details-value">
                                        {formData.email}
                                    </div>
                                </div>
                                <div className="profile-user-details clearfix">
                                    <div className="profile-user-details-label">
                                        Phone
                                    </div>
                                    <div className="profile-user-details-value">
                                        {formData.phone}
                                    </div>
                                </div>
                                <div className="profile-user-details clearfix">
                                    <div className="profile-user-details-label">
                                        Bio
                                    </div>
                                    <div className="profile-user-details-value">
                                        {formData.bio}
                                    </div>
                                </div>
                            </Col>
                        </div>

                        <Tabs className="profile-tabs" defaultActiveKey="activity">
                            <Tab eventKey="community-history" title="Community history">
                                <Table responsive>
                                    <tbody>
                                        <tr>
                                            <td className="text-center">
                                                <FaComment />
                                            </td>
                                            <td>
                                            {formData.firstName + " " + formData.lastName} posted a new post 
                                            </td>
                                        </tr>
                                        <tr>
                                            <Post isUserInformation={true} userID={userId}/>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Tab>
                            <Tab eventKey="trading-history" title="Trading history">
                                <Table responsive>
                                    <tbody>
                                        <tr>
                                            <td className="text-center">
                                                <FaComment />
                                            </td>
                                            <td>
                                            {formData.firstName + " " + formData.lastName} posted a new trading post
                                            </td>
                                        </tr>
                                        <tr>
                                            <Post />
                                        </tr>
                                    </tbody>
                                </Table>
                            </Tab>
                        </Tabs>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default UserInformation;
