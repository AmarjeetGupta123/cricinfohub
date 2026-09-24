import axios from "axios";

const RankingApi = {
  getRanking: async (compType, rankType) => {
    const response = await axios.get(
      `https://cricinfohub-api.onrender.com/api/ranking/${compType}/${rankType}`
    );

    return response.data;
  },
};

export default RankingApi;