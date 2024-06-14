import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./CompanySelection.module.css";
import { useNavigate } from "react-router-dom";
import {
  Layout,
  Spin,
  Alert,
  List,
  Input,
  Button,
  Row,
  Col,
  message,
} from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;

const CompanySelection = () => {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchVisible, setSearchVisible] = useState(false);
  const navigate = useNavigate();

  const fetchCompanies = async () => {
    const authToken = localStorage.getItem("authToken");
    try {
      const response = await axios.get(
        "https://api5.codeplayers.in/api/ListOfCompanies/520259c3-3fa6-49a2-99cb-c8504de8fb29",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const updatedCompanies = response.data.map((company) => {
        if (company.connectionStatus === "Online") {
          return { ...company, isActive: true };
        } else {
          return { ...company, isActive: false };
        }
      });
      setCompanies(updatedCompanies);
      if (updatedCompanies.length === 1) {
        // Automatically redirect to the CompanyLogin page if only one company is available
        localStorage.setItem(
          "selectedCompany",
          JSON.stringify(updatedCompanies[0])
        );
        navigate("/CompanyLogin");
      } else {
        setLoading(false);
      }
    } catch (error) {
      setError("Error fetching companies");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    const handleBackButtonClick = (event) => {
      event.preventDefault();
      navigate("/CompanySelection");
    };

    window.history.pushState(null, null, window.location.href);
    window.addEventListener("popstate", handleBackButtonClick);

    return () => {
      window.removeEventListener("popstate", handleBackButtonClick);
    };
  }, [navigate]);

  const handleReload = () => {
    setLoading(true);
    setTimeout(() => {
      window.location.reload();
    }, 500); // Adding a small delay to show the spinner
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  const handleSelectCompany = (company) => {
    if (company.isActive) {
      localStorage.setItem("selectedCompany", JSON.stringify(company));
      navigate("/CompanyLogin");
    } else {
      message.error("Company is not active");
    }
  };

  const filteredProducts = companies.filter((company) =>
    company.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className={styles.spinnerContainer}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        className={styles.header}
        style={{ position: "fixed", top: 0, left: 0 }}
      >
        <div className={styles.headerContent}>
          <img
            src="infinitylogo.png"
            height="100"
            width="200"
            alt="Infinity_logo"
            className={styles.infinityx}
          />
          <div className={styles.headerTitle}>Companies</div>
          <div className={styles.headerIcons}>
            <Button
              icon={<ReloadOutlined style={{ padding: "25px" }} />}
              onClick={handleReload}
            />
            <Button icon={<SearchOutlined />} onClick={toggleSearch} />
          </div>
        </div>
        {searchVisible && (
          <Row
            className={styles.searchBar}
            justify="center"
            style={{ position: "relative", bottom: "40%" }}
          >
            <Col xs={24} md={12}>
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                allowClear
              />
            </Col>
          </Row>
        )}
      </Header>
      <Content
        style={{
          padding: "0 50px",
          marginTop: 64,
          position: "relative",
          bottom: "-24px",
        }}
      >
        <div className={styles.companySelectionContainer}>
          <List
            grid={{
              gutter: 16,
              column: 1,
              xs: 1,
              sm: 2,
              md: 3,
              lg: 4,
              xl: 4,
              xxl: 6,
            }}
            dataSource={filteredProducts}
            renderItem={(product) => (
              <List.Item>
                <div
                  className={styles.card}
                  onClick={() => handleSelectCompany(product)}
                  style={{
                    cursor: product.isActive ? "pointer" : "not-allowed",
                  }}
                >
                  <div className={styles.cardHeader}>
                    <img
                      src="https://via.placeholder.com/100"
                      alt="Company-Logo"
                    />
                  </div>
                  <div className={styles.cardBody}>
                    
                    <h5>{product.companyName}</h5>
                    <p>01-Apr-2024 to 31-Mar-2025</p>
                    <p>SunilFive</p>
                    <div
                      className={styles.followers}
                    >
                      <div className={`${styles.status}  ${product.isActive ? styles.online : styles.offline}`}>
                        
                      </div>
                      <span className={styles.statusText}>{product.isActive ? "Online" : "Offline"}</span>
                    </div>
                  
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default CompanySelection;