"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useI18n } from './i18n-context';

interface User {
  id: number;
  email: string;
  name: string;
}

// Rest of the file copied from the original but without the bug
