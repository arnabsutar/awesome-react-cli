/**
 * @Description API configuartion for module __moduleName__
 * @FileName apiConfig.js
 * @Author awesome-react-cli
 * @CreatedOn 08 February, 2021 16:39:31
 * @IssueID NA
 */
const apiConfig = {
  __moduleName__API: {
    apiKey: '__moduleName__API',
    endpoint: `${window.SERVER_DATA.apiHost}/__moduleName__API`,
    type: 'GET',
    authenticated: true,
    showLoading: true,
  },
};

export default apiConfig;
