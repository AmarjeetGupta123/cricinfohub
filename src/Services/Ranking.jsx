import axios from "axios";

const RankingApi = {
  getRanking: async (compType, rankType) => {
    const response = await axios.get(
      `/backend-api/ranking/${compType}/${rankType}`
    );

    return response.data;
  },
};

export default RankingApi;