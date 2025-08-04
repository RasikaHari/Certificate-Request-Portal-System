package com.examly.springapp;

import java.io.File;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = SpringappApplication.class)
@AutoConfigureMockMvc
class SpringappApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testAddRequestAPI() throws Exception {
        String json = "{\"name\":\"Alice\",\"course\":\"Java\",\"email\":\"alice@mail.com\",\"completionDate\":\"2023-12-01\"}";
        mockMvc.perform(post("/addRequest")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk());
    }

    @Test
    void testGetAllRequestsAPI() throws Exception {
        mockMvc.perform(get("/getAllRequests"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    // Directory existence tests
    @Test
    void test_Controller_Directory_Exists() {
        assertTrue(new File("src/main/java/com/examly/springapp/controller").isDirectory());
    }

    @Test
    void test_Model_Directory_Exists() {
        assertTrue(new File("src/main/java/com/examly/springapp/model").isDirectory());
    }

    @Test
    void test_Repository_Directory_Exists() {
        assertTrue(new File("src/main/java/com/examly/springapp/repository").isDirectory());
    }

    @Test
    void test_Service_Directory_Exists() {
        assertTrue(new File("src/main/java/com/examly/springapp/service").isDirectory());
    }

    @Test
    void test_Config_Directory_Exists() {
        assertTrue(new File("src/main/java/com/examly/springapp/configuration").isDirectory());
    }

    // Class existence tests
    @Test
    void test_Controller_Class_Exists() {
        checkClassExists("com.examly.springapp.controller.ApiController");
    }

    @Test
    void test_Model_Class_Exists() {
        checkClassExists("com.examly.springapp.model.CertificateRequest");
    }

    @Test
    void test_Repository_Class_Exists() {
        checkClassExists("com.examly.springapp.repository.CertificateRequestRepository");
    }

    @Test
    void test_Service_Class_Exists() {
        checkClassExists("com.examly.springapp.service.CertificateService");
    }

    @Test
    void test_Config_Class_Exists() {
        checkClassExists("com.examly.springapp.configuration.CorsConfig");
    }

    // Field validation
    @Test
    void test_Model_Has_name_Field() {
        checkFieldExists("com.examly.springapp.model.CertificateRequest", "name");
    }

    @Test
    void test_Model_Has_course_Field() {
        checkFieldExists("com.examly.springapp.model.CertificateRequest", "course");
    }

    @Test
    void test_Model_Has_email_Field() {
        checkFieldExists("com.examly.springapp.model.CertificateRequest", "email");
    }

    @Test
    void test_Model_Has_completionDate_Field() {
        checkFieldExists("com.examly.springapp.model.CertificateRequest", "completionDate");
    }

    @Test
    void test_Model_Has_status_Field() {
        checkFieldExists("com.examly.springapp.model.CertificateRequest", "status");
    }

    @Test
    void test_Repository_Extends_JpaRepository() {
        checkClassImplementsInterface(
            "com.examly.springapp.repository.CertificateRequestRepository",
            "org.springframework.data.jpa.repository.JpaRepository"
        );
    }

    @Test
    void test_Config_Has_Configuration_Annotation() {
        checkClassHasAnnotation("com.examly.springapp.configuration.CorsConfig", "org.springframework.context.annotation.Configuration");
    }

    // ------------------- Helpers ----------------------

    private void checkClassExists(String className) {
        try {
            Class.forName(className);
        } catch (ClassNotFoundException e) {
            fail("Class not found: " + className);
        }
    }

    private void checkFieldExists(String className, String fieldName) {
        try {
            Class<?> clazz = Class.forName(className);
            clazz.getDeclaredField(fieldName);
        } catch (Exception e) {
            fail("Field '" + fieldName + "' not found in class " + className);
        }
    }

    private void checkClassImplementsInterface(String className, String interfaceName) {
        try {
            Class<?> clazz = Class.forName(className);
            Class<?> iface = Class.forName(interfaceName);
            assertTrue(iface.isAssignableFrom(clazz));
        } catch (Exception e) {
            fail("Interface not implemented: " + interfaceName);
        }
    }

    private void checkClassHasAnnotation(String className, String annotationClass) {
        try {
            Class<?> clazz = Class.forName(className);
            Class<?> annotation = Class.forName(annotationClass);
            assertTrue(clazz.isAnnotationPresent((Class<java.lang.annotation.Annotation>) annotation));
        } catch (Exception e) {
            fail("Annotation missing or class not found: " + annotationClass);
        }
    }
}
