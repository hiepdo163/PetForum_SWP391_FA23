import React, { useState, useEffect } from 'react';
import './Checkout.css';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import { Row, Col } from 'react-bootstrap';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import PlaceIcon from '@mui/icons-material/Place';
import MopedIcon from '@mui/icons-material/Moped';
import PaymentsIcon from '@mui/icons-material/Payments';

export const Checkout = () => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchData();
    }, []);


    const fetchData = async () => {
        try {
            const res = await fetch('https://localhost:7246/api/TradingPost');
            setFilteredPosts(res.data);
            console.log(setFilteredPosts);
        } catch (error) {
            console.log(error);
        }
    };



    //chọn địa chỉ
    const [openAddress, setOpenAddress] = React.useState(false);
    const handleOpenAddress = () => setOpenAddress(true);
    const handleCloseAddress = () => setOpenAddress(false);

    //chọn phương thức thanh toán
    const [openPayment, setOpenPayment] = React.useState(false);
    const handleOpenPayment = () => setOpenPayment(true);
    const handleClosePayment = () => setOpenPayment(false);

    const [selectedMethod, setSelectedMethod] = useState('Momo');
    const [showOptions, setShowOptions] = useState(false);

    const handleMethodChange = (method) => {
        setSelectedMethod(method);
        setShowOptions(false);
    };

    const toggleOptions = () => {
        setShowOptions((prevState) => !prevState);
    };


    return (
        <div className='checkout-form' >
            <StyledContainer className="checkout-container" >
                <div className='section address-section'>
                    <Row style={{ width: "100%" }}>
                        <Col md={12}>
                            <h1>Checkout</h1>
                            <Stack direction="row" spacing={15} alignItems="center" justifyContent={'space-evenly'}>
                                <div>
                                    <p>Tiếp Nhận</p>
                                </div>
                                <Divider
                                    orientation="horizontal"
                                    flexItem
                                    sx={{ borderBottom: '2px solid black' }}
                                />
                                <div>
                                    <p>Chốt Đơn</p>
                                </div>
                                <Divider
                                    orientation="horizontal"
                                    flexItem
                                    sx={{ borderBottom: '2px solid black' }}
                                />
                                <div>
                                    <p>Hoàn tất</p>
                                </div>
                            </Stack>
                            <Divider sx={{ border: '1px solid black' }} />
                            {/* <div style={{ paddingTop: '1em' }}>
                                <h3 style={{ display: 'flex', alignItems: 'center' }}>
                                    <PlaceIcon style={{ marginRight: '0.5em' }} />
                                    Địa chỉ Người nhận
                                </h3>
                                <div className=''>
                                    <Button onClick={handleOpenAddress}>Chọn địa chỉ giao hàng</Button>
                                    <Modal
                                        open={openAddress}
                                        onClose={handleCloseAddress}
                                    >
                                        <StyledBox>
                                            <p>Địa chỉ nhận hàng</p>
                                            <StyledBtn className='btnAddAddress'>Thêm địa chỉ mới</StyledBtn>
                                        </StyledBox>
                                    </Modal>
                                </div>
                            </div> */}
                        </Col>
                    </Row>
                </div>
            </StyledContainer>

            <StyledContainer className='checkout-form'>
                <div className='section trade-section'>
                    <Row>
                        <Col md={12}>
                            {filteredPosts && filteredPosts.map((post) => (
                                <div className='trade-post'>
                                    <header>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <img src="" alt="ava" />
                                            <span >{post.userId}</span>
                                        </div>
                                        <Button>Chat</Button>
                                    </header>
                                    <body>
                                        <img src="" alt="trade-img" />
                                        <div className='trade-info'>
                                            <span>{post.title}</span>
                                            <span>{post.price}</span>
                                        </div>
                                    </body>
                                </div>
                            ))}
                        </Col>
                    </Row>
                </div>
            </StyledContainer>

            <StyledContainer className='checkout-form'>
                <div className='section ship-section'>
                    <Row>
                        <Col md={12}>
                            <h3 style={{ display: 'flex', alignItems: 'center' }}>
                                <MopedIcon style={{ marginRight: '0.5em' }} />
                                Phương thức giao hàng
                            </h3>
                            <p>Tự thỏa thuận phí giao hàng</p>
                        </Col>
                    </Row>
                </div>
            </StyledContainer>

            <StyledContainer className='checkout-form'>
                <div className='section payment-section'>
                    <Row>
                        <Col md={12}>
                            <h3 style={{ display: 'flex', alignItems: 'center' }}>
                                <PaymentsIcon style={{ marginRight: '0.5em' }} />
                                Phương thức thanh toán
                            </h3>
                            <div className='payment-change'>
                                <p>{selectedMethod}</p>
                                <Button onClick={handleOpenPayment}>Change</Button>
                                <Modal open={openPayment} onClose={handleClosePayment}>
                                    <StyledBox
                                    >
                                        <h3>Select Payment Method</h3>
                                        <Button onClick={() => handleMethodChange('Momo')}>Momo</Button>
                                        <Button onClick={() => handleMethodChange('ATM/ Chuyển khoản')}>ATM/ Chuyển khoản</Button>
                                        <Button onClick={() => handleMethodChange('Thẻ quốc tế')}>Thẻ quốc tế</Button>
                                    </StyledBox>
                                </Modal>
                            </div>
                        </Col>
                    </Row>
                </div>
            </StyledContainer>

            <StyledContainer className='checkout-form'>
                <div className='section pay-section'>
                    <Row>
                        <Col md={12}>
                            <h3>Thông tin thanh toán</h3>
                            <div className='amount'>
                                <span>Số tiền</span>
                                <span>200000</span>
                            </div>
                            <Divider sx={{ border: '1px solid black' }} />
                            <div className='amount-confirm'>
                                <span>Tổng thanh toán</span>
                                <span>200000</span>
                            </div>
                        </Col>
                    </Row>
                </div>
            </StyledContainer>

            <StyledContainer className='checkout-form'>
                <div className='section pay-section'>
                    <Row>
                        <Col md={12}>
                            <span>Bằng việc bấm Đặt hàng, bạn đã đọc, hiểu rõ và đồng ý với Chính sách mua hàng</span>
                            <div style={{ display: 'flex', paddingTop: '2em' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', width: '30%' }}>
                                    <span>Tổng cộng:</span>
                                    <span>2000000</span>
                                </div>
                                <Button style={StyledButton}>ĐẶT HÀNG</Button>
                            </div>
                        </Col>
                    </Row>
                </div>
            </StyledContainer>
        </div>
    )
};
export default Checkout;

const StyledBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '30%',
    height: '30%',
    backgroundColor: 'white',
    border: 'none',
    borderRadius: '0.3rem',
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
    fontSize: '28px',
    fontWeight: 'bold',
    padding: '1em'
}));

const StyledBtn = styled(Button)(({ theme }) => ({
    border: "1px solid orange",
    color: "orange"

}));
const StyledButton = {
    backgroundColor: "#4a785f",
    color: "#fff",
    width: "100%",
};

const StyledContainer = styled(Container)(({ theme }) => ({
    backgroundColor: "#fff",
    width: "50%",
    borderRadius: "0.3rem",
    padding: ".8em 1.2em",
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
    marginBottom: "1.2em",
}));

