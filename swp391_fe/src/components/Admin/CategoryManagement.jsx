import React, { useState, useEffect } from 'react';
import "./CategoryManagement.css";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from 'react-bootstrap';

function CategoryManagement() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [subCategoryName, setSubCategoryName] = useState('');
    const [subCategoryDescription, setSubCategoryDescription] = useState('');
    const [mainCategoryName, setMainCategoryName] = useState('');
    const [mainCategoryDescription, setMainCategoryDescription] = useState('');
    const [showAddMainCateTable, setshowAddMainCateTable] = useState(false);
    const [showAddSubCateTable, setshowAddSubCateTable] = useState(false);
    const [mainCategoryId, setMainCategoryId] = useState(null);
    const [subCategoryId, setSubCategoryId] = useState(null);
    const [activeButton, setActiveButton] = useState(null);

    const [addError, setAddError] = useState(false);
    const [addSuccess, setAddSuccess] = useState(false);
    const [add, setAdd] = useState(false);
    const [show, setShow] = useState(false);
    const [subTableShow, setSubTableShow] = useState(false);
    const [mainCategories, setMainCategories] = useState([]);
    const [subDeleteShow, setSubDeleteShow] = useState(false);
    const [subCategories, setSubCategories] = useState([]);
    const navigate = useNavigate();

    const handleClick = (buttonName) => {
        setActiveButton(buttonName);
    }
    const handleClose = (id) => {
        setShow(false);
        setSubDeleteShow(false);
        setSubTableShow(false);
        setAdd(false);
    };
    const handleaddErrorClose = () => {
        setAddError(false);
    }
    const handleAddCateShow = (buttonId) => {
        setActiveButton(buttonId);
        setAdd(true);
    }
    const handleShow = (id, name) => {
        setMainCategoryId(id);
        setMainCategoryName(name);
        setSubTableShow(false);
        setShow(true);
    };
    const handleSubDeleteShow = (id, name) => {
        setSubCategoryId(id);
        setSubCategoryName(name);
        setSubDeleteShow(true);
    }
    const handleSubCateShow = (id, name) => {
        setMainCategoryId(id);
        setMainCategoryName(name);
        // fetchSubCategories(mainCategoryId);
        setSubTableShow(true);
    }

    useEffect(() => {
        fetchMainCategories();
        fetch('https://localhost:7246/api/Category/main category only')
            .then(response => response.json())
            .then(data => setCategories(data));
    }, []);
    useEffect(() => {
        if (mainCategoryId !== null) {
            // console.log('Main category:', mainCategoryId);
            fetchSubCategories(mainCategoryId);
            // setSubTableShow(true);
            // console.log(subCategories);
        }
    }, [mainCategoryId]);


    const
        fetchMainCategories = async () => {
            try {
                const res = await fetch('https://localhost:7246/api/Category/main category only');
                const main = await res.json();
                setMainCategories(main);
            } catch (err) {
                console.log(err);
            }
        };

    const fetchSubCategories = async (mainCategoryId) => {
        try {
            const res = await fetch(`https://localhost:7246/api/Category/child/${mainCategoryId}`);
            const sub = await res.json();
            if (sub != null) {
                setSubCategories(sub);
            }
            else {
                setSubCategories([{ name: 'Null', description: 'Null' }]);
            }
        } catch (err) {
            console.log('Lỗi rồi:', err);
        }
    };

    //Add categories
    const handleAdd = () => {
        if (activeButton === 'AddMainCategory') {
            handleAddMainCategory();
        } else if (activeButton === 'AddSubCategory') {
            handleAddSubCategory();
        }
        handleClose();
    };
    const handleAddMainCategory = () => {
        if (!mainCategoryName || !mainCategoryDescription) {
            setAddError(true);
            return;
        }
        fetch(`https://localhost:7246/api/Category/main`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: mainCategoryName,
                description: mainCategoryDescription,
            }),
        })
            .then(response => response.json())
            .then(data => console.log(data));
        setAddSuccess(true);
        setTimeout(() => {
            setAddSuccess(false);
        }, 1000);
        // fetchMainCategories();
        navigate(0);

    };

    const handleAddSubCategory = () => {
        if (!selectedCategory || !subCategoryName || !subCategoryDescription) {
            setAddError(true);
            return;
        }
        fetch(`https://localhost:7246/api/Category/child/${selectedCategory}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: subCategoryName,
                description: subCategoryDescription,
            }),
        })
            .then(response => response.json())
            .then(data => console.log(data));
        setAddSuccess(true);
        setTimeout(() => {
            setAddSuccess(false);
        }, 1000);
    };
    const handleDelete = async (id) => {
        try {
            // console.log(mainCategoryId);
            const response = await fetch(`https://localhost:7246/api/Category/main/${mainCategoryId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            handleClose();
            // navigate(0);
            fetchMainCategories();
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const handleSubDelete = async (id) => {
        try {
            const response = await fetch(`https://localhost:7246/api/Category/child/${subCategoryId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            setSubDeleteShow(false);
            fetchSubCategories(mainCategoryId);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div>
            <div className='addCategory'>
                <h1>Add Categories</h1>
                <button className={activeButton === 'main' ? 'btnActive active' : 'btnActive'} onClick={() => { setshowAddMainCateTable(true); setshowAddSubCateTable(false); handleClick('main'); }} >Add Main Categories</button>
                <button className={activeButton === 'child' ? 'btnActive active' : 'btnActive'} onClick={() => { setshowAddMainCateTable(false); setshowAddSubCateTable(true); handleClick('child'); }}>Add Child Categories</button>

            </div>
            <div>
                {showAddMainCateTable && (
                    <table onclick="handleEnabletable" className='table'>
                        <thead className='cateTHead'>
                            <tr>
                                {/* <th></th> */}
                                <th>Name</th>
                                <th>Description</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody className='cateTBody'>
                            <tr>
                                {/* <td></td> */}
                                <td><input type="text" value={mainCategoryName} onChange={e => setMainCategoryName(e.target.value)} /></td>
                                <td><input type="text" value={mainCategoryDescription} onChange={e => setMainCategoryDescription(e.target.value)} /></td>
                                <td><button className='btnDelete' id='AddMainCategory' onClick={() => handleAddCateShow('AddMainCategory')} >Add Category</button></td>
                            </tr>
                        </tbody>
                    </table>
                )}
            </div>
            <div>
                {showAddSubCateTable && (
                    <table onclick="handleEnabletable" className='table'>
                        <thead className='cateTHead'>
                            <tr>
                                <th>Main Categories</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody className='cateTBody'>
                            <tr>
                                <td>
                                    <select className='main-category' value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                                        <option> Choose a main category</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        ))}
                                    </select>
                                </td>
                                <td><input type="text" value={subCategoryName} onChange={e => setSubCategoryName(e.target.value)} /></td>
                                <td><input type="text" value={subCategoryDescription} onChange={e => setSubCategoryDescription(e.target.value)} /></td>
                                <td><button className='btnDelete' id='AddSubCategory' onClick={() => handleAddCateShow('AddSubCategory')}>Add Category</button></td>
                            </tr>
                        </tbody>
                    </table>
                )}
            </div>
            <br></br>
            <div>
                <h1>Category List</h1>
                <table className='table'>
                    <thead>
                        <tr>
                            {/* <th>Id</th> */}
                            <th className='NameShow'>Name</th>
                            <th>Description</th>
                            <th className='actionShow' >Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mainCategories.map((mainCategory) => (
                            <React.Fragment key={mainCategory.id}>
                                <tr className='listMainCate'>
                                    {/* <td>{mainCategory.id}</td> */}
                                    <td>{mainCategory.name}</td>
                                    <td>{mainCategory.description}</td>
                                    <td className='actionShow' >
                                        <button className='btnDelete' onClick={() => handleShow(mainCategory.id, mainCategory.name)}>
                                            Delete
                                        </button>
                                        <button className='btnDelete' onClick={() => handleSubCateShow(mainCategory.id, mainCategory.name)}>
                                            Child Category
                                        </button>
                                    </td>
                                </tr>
                                <>
                                    <Modal show={subTableShow} onHide={handleClose}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Child Categories of <span style={{ fontWeight: 'bolder', color: '#4a785f' }}> {mainCategoryName}</span>
                                            </Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <table className='table'>
                                                <thead>
                                                    <tr>
                                                        {/* <th>Id</th> */}
                                                        <th>Name</th>
                                                        <th>Description</th>
                                                        <th className='subActionShow'>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {subCategories.map((subCategory) => (
                                                        <React.Fragment key={subCategory.id}>
                                                            <tr className='listMainCate'>
                                                                {/* <td>{mainCategory.id}</td> */}
                                                                <td>{subCategory.name}</td>
                                                                <td>{subCategory.description}</td>
                                                                <td>
                                                                    <button className='btnDelete' onClick={() => handleSubDeleteShow(subCategory.id, subCategory.name)}>
                                                                        Delete
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        </React.Fragment>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={handleClose}>
                                                Close
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                </>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
            <br></br>
            <>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete main categories: <span style={{ fontWeight: 'bolder', color: '#4a785f' }}>{mainCategoryName}</span> ?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
            <>
                <Modal show={subDeleteShow} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete child categories: <span style={{ fontWeight: 'bolder', color: '#4a785f' }}>{subCategoryName}</span> of main categories: <span style={{ fontWeight: 'bolder', color: '#4a785f' }}> {mainCategoryName} </span> ?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleSubDelete}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
            <>
                <Modal show={add} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Add</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to add category ?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="success" onClick={handleAdd}>
                            Add
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
            <>
                <Modal show={addSuccess} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Notification</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Add Success!
                    </Modal.Body>
                </Modal>
            </>
            <>
                <Modal show={addError} onHide={handleClose}>
                    <Modal.Header>
                        <Modal.Title>Add Error</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Fill all of input box!
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleaddErrorClose}>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        </div>
    );
}

export default CategoryManagement;
