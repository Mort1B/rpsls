/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
    ethers,
    EventFilter,
    Signer,
    BigNumber,
    BigNumberish,
    PopulatedTransaction,
    BaseContract,
    ContractTransaction,
    Overrides,
    PayableOverrides,
    CallOverrides,
  } from "ethers";
  import { BytesLike } from "@ethersproject/bytes";
  import { Listener, Provider } from "@ethersproject/providers";
  import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
  import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";
  
  interface RPSInterface extends ethers.utils.Interface {
    functions: {
      "win(uint8,uint8)": FunctionFragment;
      "j2Timeout()": FunctionFragment;
      "stake()": FunctionFragment;
      "c2()": FunctionFragment;
      "c1Hash()": FunctionFragment;
      "play(uint8)": FunctionFragment;
      "j2()": FunctionFragment;
      "lastAction()": FunctionFragment;
      "solve(uint8,uint256)": FunctionFragment;
      "j1()": FunctionFragment;
      "j1Timeout()": FunctionFragment;
      "TIMEOUT()": FunctionFragment;
    };
  
    encodeFunctionData(
      functionFragment: "win",
      values: [BigNumberish, BigNumberish]
    ): string;
    encodeFunctionData(functionFragment: "j2Timeout", values?: undefined): string;
    encodeFunctionData(functionFragment: "stake", values?: undefined): string;
    encodeFunctionData(functionFragment: "c2", values?: undefined): string;
    encodeFunctionData(functionFragment: "c1Hash", values?: undefined): string;
    encodeFunctionData(functionFragment: "play", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "j2", values?: undefined): string;
    encodeFunctionData(
      functionFragment: "lastAction",
      values?: undefined
    ): string;
    encodeFunctionData(
      functionFragment: "solve",
      values: [BigNumberish, BigNumberish]
    ): string;
    encodeFunctionData(functionFragment: "j1", values?: undefined): string;
    encodeFunctionData(functionFragment: "j1Timeout", values?: undefined): string;
    encodeFunctionData(functionFragment: "TIMEOUT", values?: undefined): string;
  
    decodeFunctionResult(functionFragment: "win", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "j2Timeout", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "stake", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "c2", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "c1Hash", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "play", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "j2", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lastAction", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "solve", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "j1", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "j1Timeout", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "TIMEOUT", data: BytesLike): Result;
  
    events: {};
  }
  
  export class RPS extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
  
    listeners<EventArgsArray extends Array<any>, EventArgsObject>(
      eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
    ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
    off<EventArgsArray extends Array<any>, EventArgsObject>(
      eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
      listener: TypedListener<EventArgsArray, EventArgsObject>
    ): this;
    on<EventArgsArray extends Array<any>, EventArgsObject>(
      eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
      listener: TypedListener<EventArgsArray, EventArgsObject>
    ): this;
    once<EventArgsArray extends Array<any>, EventArgsObject>(
      eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
      listener: TypedListener<EventArgsArray, EventArgsObject>
    ): this;
    removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
      eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
      listener: TypedListener<EventArgsArray, EventArgsObject>
    ): this;
    removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
      eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
    ): this;
  
    listeners(eventName?: string): Array<Listener>;
    off(eventName: string, listener: Listener): this;
    on(eventName: string, listener: Listener): this;
    once(eventName: string, listener: Listener): this;
    removeListener(eventName: string, listener: Listener): this;
    removeAllListeners(eventName?: string): this;
  
    queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
      event: TypedEventFilter<EventArgsArray, EventArgsObject>,
      fromBlockOrBlockhash?: string | number | undefined,
      toBlock?: string | number | undefined
    ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;
  
    interface: RPSInterface;
  
    functions: {
      win(
        _c1: BigNumberish,
        _c2: BigNumberish,
        overrides?: CallOverrides
      ): Promise<[boolean] & { w: boolean }>;
  
      j2Timeout(
        overrides?: Overrides & { from?: string | Promise<string> }
      ): Promise<ContractTransaction>;
  
      stake(overrides?: CallOverrides): Promise<[BigNumber]>;
  
      c2(overrides?: CallOverrides): Promise<[number]>;
  
      c1Hash(overrides?: CallOverrides): Promise<[string]>;
  
      play(
        _c2: BigNumberish,
        overrides?: PayableOverrides & { from?: string | Promise<string> }
      ): Promise<ContractTransaction>;
  
      j2(overrides?: CallOverrides): Promise<[string]>;
  
      lastAction(overrides?: CallOverrides): Promise<[BigNumber]>;
  
      solve(
        _c1: BigNumberish,
        _salt: BigNumberish,
        overrides?: Overrides & { from?: string | Promise<string> }
      ): Promise<ContractTransaction>;
  
      j1(overrides?: CallOverrides): Promise<[string]>;
  
      j1Timeout(
        overrides?: Overrides & { from?: string | Promise<string> }
      ): Promise<ContractTransaction>;
  
      TIMEOUT(overrides?: CallOverrides): Promise<[BigNumber]>;
    };
  
    win(
      _c1: BigNumberish,
      _c2: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;
  
    j2Timeout(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  
    stake(overrides?: CallOverrides): Promise<BigNumber>;
  
    c2(overrides?: CallOverrides): Promise<number>;
  
    c1Hash(overrides?: CallOverrides): Promise<string>;
  
    play(
      _c2: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  
    j2(overrides?: CallOverrides): Promise<string>;
  
    lastAction(overrides?: CallOverrides): Promise<BigNumber>;
  
    solve(
      _c1: BigNumberish,
      _salt: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  
    j1(overrides?: CallOverrides): Promise<string>;
  
    j1Timeout(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  
    TIMEOUT(overrides?: CallOverrides): Promise<BigNumber>;
  
    callStatic: {
      win(
        _c1: BigNumberish,
        _c2: BigNumberish,
        overrides?: CallOverrides
      ): Promise<boolean>;
  
      j2Timeout(overrides?: CallOverrides): Promise<void>;
  
      stake(overrides?: CallOverrides): Promise<BigNumber>;
  
      c2(overrides?: CallOverrides): Promise<number>;
  
      c1Hash(overrides?: CallOverrides): Promise<string>;
  
      play(_c2: BigNumberish, overrides?: CallOverrides): Promise<void>;
  
      j2(overrides?: CallOverrides): Promise<string>;
  
      lastAction(overrides?: CallOverrides): Promise<BigNumber>;
  
      solve(
        _c1: BigNumberish,
        _salt: BigNumberish,
        overrides?: CallOverrides
      ): Promise<void>;
  
      j1(overrides?: CallOverrides): Promise<string>;
  
      j1Timeout(overrides?: CallOverrides): Promise<void>;
  
      TIMEOUT(overrides?: CallOverrides): Promise<BigNumber>;
    };
  
    filters: {};
  
    estimateGas: {
      win(
        _c1: BigNumberish,
        _c2: BigNumberish,
        overrides?: CallOverrides
      ): Promise<BigNumber>;
  
      j2Timeout(
        overrides?: Overrides & { from?: string | Promise<string> }
      ): Promise<BigNumber>;
  
      stake(overrides?: CallOverrides): Promise<BigNumber>;
  
      c2(overrides?: CallOverrides): Promise<BigNumber>;
  
      c1Hash(overrides?: CallOverrides): Promise<BigNumber>;
  
      play(
        _c2: BigNumberish,
        overrides?: PayableOverrides & { from?: string | Promise<string> }
      ): Promise<BigNumber>;
  
      j2(overrides?: CallOverrides): Promise<BigNumber>;
  
      lastAction(overrides?: CallOverrides): Promise<BigNumber>;
  
      solve(
        _c1: BigNumberish,
        _salt: BigNumberish,
        overrides?: Overrides & { from?: string | Promise<string> }
      ): Promise<BigNumber>;
  
      j1(overrides?: CallOverrides): Promise<BigNumber>;
  
      j1Timeout(
        overrides?: Overrides & { from?: string | Promise<string> }
      ): Promise<BigNumber>;
  
      TIMEOUT(overrides?: CallOverrides): Promise<BigNumber>;
    };
  
    populateTransaction: {
      win(
        _c1: BigNumberish,
        _c2: BigNumberish,
        overrides?: CallOverrides
      ): Promise<PopulatedTransaction>;
  
      j2Timeout(
        overrides?: Overrides & { from?: string | Promise<string> }
      ): Promise<PopulatedTransaction>;
  
      stake(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  
      c2(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  
      c1Hash(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  
      play(
        _c2: BigNumberish,
        overrides?: PayableOverrides & { from?: string | Promise<string> }
      ): Promise<PopulatedTransaction>;
  
      j2(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  
      lastAction(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  
      solve(
        _c1: BigNumberish,
        _salt: BigNumberish,
        overrides?: Overrides & { from?: string | Promise<string> }
      ): Promise<PopulatedTransaction>;
  
      j1(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  
      j1Timeout(
        overrides?: Overrides & { from?: string | Promise<string> }
      ): Promise<PopulatedTransaction>;
  
      TIMEOUT(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
  }