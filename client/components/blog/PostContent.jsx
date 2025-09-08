'use client';

import { useMemo } from 'react';
import { getMDXComponent } from 'mdx-bundler/client';
import MDXComponents from './MDXComponents';

export default function PostContent({ code }) {
  const Component = useMemo(() => getMDXComponent(code), [code]);
  
  return <Component components={MDXComponents} />;
}