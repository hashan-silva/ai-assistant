package com.helpclub.platform.service;

public enum InstructionAudience {
    JOB_SEEKER("system-job-seeker.md"),
    JOB_POSTER("system-job-poster.md");

    private final String systemFilename;

    InstructionAudience(String systemFilename) {
        this.systemFilename = systemFilename;
    }

    public String systemFilename() {
        return systemFilename;
    }
}
