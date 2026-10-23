import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ProtoProvider, useProto } from './store';

afterEach(() => vi.useRealTimers());
describe('Version 2 in-memory journey', () => {
  it('cycles the first dress and uses it as the current dress after ordering', () => {
    const { result } = renderHook(useProto, { wrapper: ProtoProvider });
    act(() => result.current.cycle());
    act(() => result.current.order());
    expect(result.current.currentId).toBe('d2');
    expect(result.current.sentIds).toEqual(['d2']);
    expect(result.current.ordered).toBe(true);
  });
  it('advances current dress and offers the remaining unsent dress next', () => {
    const { result } = renderHook(useProto, { wrapper: ProtoProvider });
    act(() => result.current.order());
    act(() => result.current.sendNext());
    expect(result.current.currentId).toBe('d2');
    expect(result.current.previousId).toBe('d1');
    expect(result.current.sentIds).toEqual(['d1', 'd2']);
    expect(result.current.nextId).toBe('d3');
    expect(result.current.screen).toBe('sent');
  });
  it('undo restores kept sizes without charging other dresses within 24 hours', () => {
    vi.useFakeTimers(); vi.setSystemTime(new Date('2026-10-22T22:00:00Z'));
    const { result } = renderHook(useProto, { wrapper: ProtoProvider });
    act(() => result.current.order());
    act(() => result.current.keep('credit'));
    expect(result.current.keptAt).not.toBeNull();
    act(() => result.current.undo());
    expect(result.current.keptAt).toBeNull();
    expect(result.current.sentIds).toEqual(['d1']);
  });
  it('cannot undo after 24 hours', () => {
    vi.useFakeTimers(); vi.setSystemTime(new Date('2026-10-22T22:00:00Z'));
    const { result } = renderHook(useProto, { wrapper: ProtoProvider });
    act(() => result.current.keep('congrats'));
    const keptAt = result.current.keptAt;
    vi.setSystemTime(new Date('2026-10-23T22:00:00Z'));
    act(() => result.current.undo());
    expect(result.current.keptAt).toBe(keptAt);
  });
});