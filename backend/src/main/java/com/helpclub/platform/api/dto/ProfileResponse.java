package com.helpclub.platform.api.dto;

public class ProfileResponse {

    private String personalNumber;
    private String email;
    private String phone;
    private String firstName;
    private String lastName;
    private String city;
    private String profileType;

    public ProfileResponse() {
    }

    public ProfileResponse(
        String personalNumber,
        String email,
        String phone,
        String firstName,
        String lastName,
        String city,
        String profileType
    ) {
        this.personalNumber = personalNumber;
        this.email = email;
        this.phone = phone;
        this.firstName = firstName;
        this.lastName = lastName;
        this.city = city;
        this.profileType = profileType;
    }

    public String getPersonalNumber() {
        return personalNumber;
    }

    public void setPersonalNumber(String personalNumber) {
        this.personalNumber = personalNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getProfileType() {
        return profileType;
    }

    public void setProfileType(String profileType) {
        this.profileType = profileType;
    }
}
