import request from "./index";

//Navbar
function fetchNavbarData(data) {
  return request.post("get_header", data);
}

//Home page - slider
function fetchSlider(data) {
  return request.post("get_slider", data);
}

//Home page - live video
function fetchliveVideo(data) {
  return request.post("home_live_setting", data);
}

//Home page - publication
function fetchPublication(data) {
  return request.post("home_publication", data);
}

//Home page - activitiy
function fetchActivitiy(data) {
  return request.post("home_actiivty", data);
}

//Home page - sant photos
function fetchSantPhotos(data) {
  return request.post("home_sant", data);
}

// Home page
// function fetchHomepageData(data) {
//   return request.post("/home", data);
// }

// Branches
function fetchBranchespageData(data) {
  return request.post("/branch", data);
}

// Daily katha
function fetchDailykathaData(data) {
  return request.post("/daily", data);
}

//Daily darshan
function fetchDailyDarshanData(data) {
  return request.post("/daily", data);
}

//Contact details
function fetchContactDetails(data) {
  return request.post("/contact_us", data);
}

// Donation list
function fetchDonationList(data) {
  return request.post("donation_list", data);
}

//Footer
function fetchFooterData(data) {
  return request.post("/get_footer", data);
}

//Activity - list
function fetchActivitiyList(data) {
  const { pageData = 1, per_page = 12, search = '', ...otherData } = data;
  // Ensure we don't request beyond available data
  if (pageData > Math.ceil(data.total / per_page)) {
    return Promise.resolve({ data: { responseBody: { list: [], total: data.total } } });
  }
  return request.post(
    `activity_list?page=${pageData}&per_page=${per_page}&search=${search}`,
    otherData
  );
}

//Activity - Details
function fetchActivitiyDetails(data) {
  return request.post("activity_details", data);
}

//Publication list
function fetchPublicationList(data) {
  const { pageData = 1, per_page = 10, ...otherData } = data;
  return request.post(`publication_list?page=${pageData}&per_page=${per_page}`, otherData);
}

//Publication details
function fetchPublicationDetails(data) {
  return request.post("publication_details", data);
}

//Contact-us
function contactDetails(data) {
  return request.post("send_contact_us", data);
}

//Donation send-otp
function sendOtp(data) {
  return request.post("send_otp", data);
}

//Donation verify-OTP
function verifyOtp(data) {
  return request.post("verify_otp", data);
}

//Donation retrieve - info
function retrieveInfo(data) {
  return request.post("get_doner", data);
}

//Donation page - country list
function countryData() {
  return request.get("get_country");
}

//Donation page - Paymet
function paymentData(data) {
  return request.post("payment", data);
}

//Terms and Conditions
function termsAndCondition(data) {
  return request.post("term_condition", data);
}

//About us - main page
function fetchAboutusData(data) {
  return request.post("about_us_main", data);
}

//About us - details page
function fetchAboutusDetails(data) {
  return request.post("about_us_header_details", data);
}

//About us - footer detail
function fetchAboutusFooterDertails(data) {
  return request.post("about_us_footer_details", data);
}

//Publication search
function fetchPublicationSearchData(params, searchData) {
  return request.post(`publication_search?search=${searchData}`, params);
}

function fetchSantDetails(params) {
  return request.post('sant_details', params)
}

//Download all audio
function downloadAudio(data) {
  return request.post("dowanload_audio", data);
}

function customDetailPage(data) {
  return request.post("/custom_details", data)
}

//Donors
function fetchDonation(data) {
  return request.post("/get_donation_blog", data);
}

//Donation members list
function fetchDonationMembersList(data) {
  return request.post("/get_member_data", data);
}

//SMS pdf
function getPdf(data) {
  return request.post("get_pdf", data);
}

// Get branch
function getBranch(data) {
  return request.post("/get_branch", data);
}

function getMemberData(data) {
  return request.post("/get_member_data/", data);
}
export {
  fetchNavbarData,
  fetchSlider,
  fetchliveVideo,
  fetchPublication,
  fetchActivitiy,
  fetchSantPhotos,
  // fetchHomepageData,
  fetchBranchespageData,
  fetchDailykathaData,
  fetchDailyDarshanData,
  fetchContactDetails,
  fetchDonationList,
  fetchDonationMembersList,
  fetchFooterData,
  fetchActivitiyList,
  fetchActivitiyDetails,
  fetchPublicationList,
  fetchPublicationDetails,
  contactDetails,
  sendOtp,
  verifyOtp,
  retrieveInfo,
  countryData,
  paymentData,
  termsAndCondition,
  fetchAboutusData,
  fetchAboutusDetails,
  fetchAboutusFooterDertails,
  fetchPublicationSearchData,
  fetchSantDetails,
  downloadAudio,
  customDetailPage,
  fetchDonation,
  getPdf,
  getBranch,
  getMemberData
};
