package com.helpclub.platform.api.dto;

import java.util.List;

public class ChatResponse {

    private String reply;
    private List<String> updatedFields;
    private List<String> matchSummaries;

    public ChatResponse() {
    }

    public ChatResponse(String reply, List<String> updatedFields, List<String> matchSummaries) {
        this.reply = reply;
        this.updatedFields = updatedFields;
        this.matchSummaries = matchSummaries;
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public List<String> getUpdatedFields() {
        return updatedFields;
    }

    public void setUpdatedFields(List<String> updatedFields) {
        this.updatedFields = updatedFields;
    }

    public List<String> getMatchSummaries() {
        return matchSummaries;
    }

    public void setMatchSummaries(List<String> matchSummaries) {
        this.matchSummaries = matchSummaries;
    }
}
