export default {
	data() {
		return {};
	},
	methods: {
        mapReportAbuseReason(reason) {
            let data;
            if (reason === "CONFIDENTIAL_CONTENT") {
              data = this.NLS.ConfidentialContent;
              return data;
            } else if (reason === "INAPPROPRIATE_BEHAVIOR") {
              data = this.NLS.InappropiateBahavior;
              return data;
            } else if (reason === "ILLEGAL_CONTENT") {
              data = this.NLS.IllegalContent;
              return data;
            } else if (reason === "SUSPICIOUS_ACTIVITIES") {
              data = this.NLS.CrminalOffense;
              return data;
            } else if (reason === "SPAM") {
              data = this.NLS.Spam;
              return data;
            } else {
              data = this.NLS.Other;
              return data;
            }
          },
          mapContentType(type) {
            let data;
            if (type === "POST") {
              data = "Post";
              return data;
            } else if (type === "IDEATION") {
              data = "Idea";
              return data;
            } else if (type === "MEDIA") {
              data = "Media";
              return data;
            } else if (type === "QUESTION") {
              data = "Question";
              return data;
            } else if (type === "SURVEY") {
              data = "Survey";
              return data;
            } else if (type === "WIKI_PAGE") {
              data = "Wiki";
              return data;
            } else if (type === "COMMENT") {
              data = "Comment";
              return data;
            } else if (type === "ANSWER") {
              data = "Answer";
              return data;
            } else if (type === "CONFERENCE") {
              data = "Meeting";
              return data;
            }
          },
          createUrlContent(urlChain, communityUri,contentUri,commentUri) {
            let url;
            if (!urlChain) {
              url = `/community/${communityUri}?content=${contentUri}`;
              return url;
            }
            else if(urlChain.length === 0)
            {
              url = `/community/${communityUri}?content=${contentUri}&comment=${commentUri}`;
              return url;
            }
            else if(urlChain.length === 1)
            {
              url = `/community/${communityUri}?content=${contentUri}&comment=${urlChain[0]}&reply=${commentUri}`;
              return url;
            }
          },
          createQuestionContentUrl(urlChain, communityUri,contentUri,commentUri){
            let url;
            if (!urlChain) {
              url = `/community/${communityUri}/question?content=${contentUri}`;
              return url;
            }
            else if(urlChain.length === 0)
            {
              url = `/community/${communityUri}/question?content=${contentUri}&answer=${commentUri}`;
              return url;
            }
            else if(urlChain.length === 1)
            {
              url = `/community/${communityUri}/question?content=${contentUri}&answer=${urlChain[0]}&comment=${commentUri}`;
              return url;
            }
            else if(urlChain.length === 2)
            {
              url = `/community/${communityUri}/question?content=${contentUri}&answer=${urlChain[1]}&comment=${urlChain[0]}&reply=${commentUri}`;
              return url;
            }
          },
	}
};
