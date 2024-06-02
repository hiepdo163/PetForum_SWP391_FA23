import './ShareOption.css';
import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FacebookShareButton, TwitterShareButton, FacebookIcon, TwitterIcon, FacebookMessengerShareButton, FacebookMessengerIcon, TelegramShareButton, TelegramIcon, EmailShareButton, EmailIcon, RedditShareButton, RedditIcon, LineShareButton, LineIcon } from 'react-share';
import { BsFillShareFill } from "react-icons/bs";
import  zalo  from '../img/icon/zalo.png';
function ShareOption({ show, handleClose }) {
    const [showModal, setShowModal] = useState(false);
    const [copied, setCopied] = useState(false);
    const currentURL = window.location.href;

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleCopyLink = () => {
        const input = document.createElement("input");
        input.value = currentURL;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
        setCopied(true);
        setShowModal(false);
        alert("Đã sao chép liên kết!");

    };

    return (
        <div>
            <button onClick={handleShowModal} style={{ border: 'none' }}><BsFillShareFill /></button>
            <Modal show={showModal} onHide={handleCloseModal} style={{ display: 'flex', alignItems: 'center', marginTop: '15%' }}>
                <Modal.Header closeButton id="contained-modal-title-vcenter">
                    <Modal.Title>Share to . . . .</Modal.Title>
                </Modal.Header>
                <Modal.Body className='share-body'>
                    <div className='icon-body'>
                        <FacebookShareButton url={currentURL} hashtag={"#pettimeee"} className='icon-body'>
                            <FacebookIcon size={40} round className='icon-design' />
                        </FacebookShareButton>
                        <TwitterShareButton url={currentURL} hashtags={["pettimeee"]} className='icon-body'>
                            <TwitterIcon size={40} round className='icon-design' />
                        </TwitterShareButton>
                        <FacebookMessengerShareButton url={currentURL} className='icon-body'>
                            <FacebookMessengerIcon size={40} round className='icon-design' />
                        </FacebookMessengerShareButton>
                        <TelegramShareButton url={currentURL} hashtag={"#pettimeee"} title ="Hãy tham gia cộng đồng những người yêu thích chó mèo để xem thêm nhiều thông tin bổ ích khác" className='icon-body'>
                            <TelegramIcon size={40} round className='icon-design' />
                        </TelegramShareButton>
                        <EmailShareButton url={currentURL} hashtag={"#pettimeee"} subject ="Hãy tham gia cộng đồng những người yêu thích chó mèo để xem thêm nhiều thông tin bổ ích khác" body='Xem thêm tại: ' className='icon-body'>
                            <EmailIcon size={40} round className='icon-design' />
                        </EmailShareButton>
                        <RedditShareButton url={currentURL} hashtag={"#pettimeee"} className='icon-body'>
                            <RedditIcon size={40} round className='icon-design' />
                        </RedditShareButton>
                    </div>
                    <div className="share-manual">
                        <input type="text" value={currentURL} readOnly style={{ padding: '10px' }} />
                        <button onClick={handleCopyLink}>
                            {copied ? "Copied!" : "Copy Link"}
                        </button>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <div>Pet'sForum.com</div>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ShareOption;
